import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddWishlistItemDto, ToggleWishlistDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            brand: { select: { id: true, name: true, nameAr: true, slug: true } },
            category: { select: { id: true, name: true, nameAr: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        nameAr: item.product.nameAr,
        slug: item.product.slug,
        price: Number(item.product.price),
        compareAtPrice: item.product.compareAtPrice
          ? Number(item.product.compareAtPrice)
          : null,
        image: item.product.images[0]?.url ?? null,
        isActive: item.product.isActive,
        brand: item.product.brand,
        category: item.product.category,
      },
    }));
  }

  async addItem(userId: string, dto: AddWishlistItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });
    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    const item = await this.prisma.wishlistItem.create({
      data: { userId, productId: dto.productId },
    });

    return { id: item.id, productId: item.productId, message: 'Added to wishlist' };
  }

  async removeItem(userId: string, productId: string) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');
    await this.prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { message: 'Removed from wishlist' };
  }

  async toggle(userId: string, dto: ToggleWishlistDto) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });

    if (existing) {
      await this.prisma.wishlistItem.delete({
        where: { userId_productId: { userId, productId: dto.productId } },
      });
      return { inWishlist: false, message: 'Removed from wishlist' };
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.wishlistItem.create({
      data: { userId, productId: dto.productId },
    });

    return { inWishlist: true, message: 'Added to wishlist' };
  }
}
