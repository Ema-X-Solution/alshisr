import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto';

const cartInclude = {
  product: {
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      brand: { select: { id: true, name: true, nameAr: true, slug: true } },
    },
  },
  variant: true,
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: cartInclude,
      orderBy: { createdAt: 'desc' },
    });

    const serialized = items.map((item) => this.serializeCartItem(item));
    const subtotal = serialized.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return {
      items: serialized,
      itemCount: serialized.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: Math.round(subtotal * 100) / 100,
    };
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { variants: true },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    const quantity = dto.quantity ?? 1;
    let unitPrice = Number(product.price);
    let availableStock = product.stock;

    if (dto.variantId) {
      const variant = product.variants.find((v) => v.id === dto.variantId && v.isActive);
      if (!variant) throw new NotFoundException('Product variant not found');
      unitPrice = Number(variant.price);
      availableStock = variant.stock;
    } else if (product.hasVariants) {
      throw new BadRequestException('Variant selection is required for this product');
    }

    if (availableStock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const variantKey = dto.variantId ?? null;
    const existing = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId: dto.productId,
        variantId: variantKey,
      },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (availableStock < newQty) {
        throw new BadRequestException('Insufficient stock');
      }
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
        include: cartInclude,
      }).then((item) => this.serializeCartItem(item));
    }

    const item = await this.prisma.cartItem.create({
      data: {
        userId,
        productId: dto.productId,
        variantId: dto.variantId,
        quantity,
      },
      include: cartInclude,
    });

    return this.serializeCartItem(item);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { product: true, variant: true },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    const availableStock = item.variant ? item.variant.stock : item.product.stock;
    if (availableStock < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const updated = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: cartInclude,
    });

    return this.serializeCartItem(updated);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { message: 'Cart cleared' };
  }

  private serializeCartItem(item: {
    id: string;
    quantity: number;
    productId: string;
    variantId: string | null;
    product: {
      id: string;
      name: string;
      nameAr: string;
      slug: string;
      price: unknown;
      stock: number;
      isActive: boolean;
      images: { url: string; alt: string | null }[];
      brand: { id: string; name: string; nameAr: string; slug: string } | null;
    };
    variant: {
      id: string;
      sku: string;
      price: unknown;
      stock: number;
      attributes: unknown;
    } | null;
  }) {
    const unitPrice = item.variant
      ? Number(item.variant.price)
      : Number(item.product.price);

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice,
      totalPrice: Math.round(unitPrice * item.quantity * 100) / 100,
      product: {
        id: item.product.id,
        name: item.product.name,
        nameAr: item.product.nameAr,
        slug: item.product.slug,
        image: item.product.images[0]?.url ?? null,
        brand: item.product.brand,
      },
      variant: item.variant
        ? {
            id: item.variant.id,
            sku: item.variant.sku,
            price: Number(item.variant.price),
            attributes: item.variant.attributes,
          }
        : null,
    };
  }
}
