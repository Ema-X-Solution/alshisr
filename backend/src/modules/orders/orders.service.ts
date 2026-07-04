import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { OrderStatus, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { generateOrderNumber, buildPaginationMeta, getPaginationOffset } from '@alshisr/shared';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderFilterDto,
} from './orders.dto';
import { CouponsService } from '../coupons/coupons.service';

const orderInclude = {
  items: true,
  timeline: { orderBy: { createdAt: 'asc' as const } },
  user: { select: { id: true, email: true, firstName: true, lastName: true } },
};

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private couponsService: CouponsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        variant: true,
      },
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    for (const item of cartItems) {
      if (!item.product.isActive) {
        throw new BadRequestException(`Product "${item.product.name}" is no longer available`);
      }
      const stock = item.variant ? item.variant.stock : item.product.stock;
      if (stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for "${item.product.name}"`);
      }
    }

    let subtotal = 0;
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = cartItems.map((item) => {
      const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
      const total = price * item.quantity;
      subtotal += total;
      return {
        product: { connect: { id: item.productId } },
        ...(item.variantId ? { variant: { connect: { id: item.variantId } } } : {}),
        name: item.product.name,
        nameAr: item.product.nameAr,
        sku: item.variant?.sku ?? item.product.sku,
        price,
        quantity: item.quantity,
        total,
        image: item.product.images[0]?.url ?? null,
      };
    });

    let discount = 0;
    if (dto.couponCode) {
      const couponResult = await this.couponsService.validateCoupon(dto.couponCode, subtotal);
      discount = couponResult.discount;
    }

    const shippingCost = dto.shippingCost ?? 0;
    const tax = 0;
    const total = Math.max(0, subtotal - discount + shippingCost + tax);

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          paymentMethod: dto.paymentMethod,
          subtotal,
          discount,
          shippingCost,
          tax,
          total,
          couponCode: dto.couponCode,
          notes: dto.notes,
          shippingAddress: dto.shippingAddress as unknown as Prisma.InputJsonValue,
          billingAddress: dto.billingAddress
            ? (dto.billingAddress as unknown as Prisma.InputJsonValue)
            : undefined,
          items: { create: orderItemsData },
          timeline: {
            create: { status: OrderStatus.PENDING, note: 'Order placed' },
          },
        },
        include: orderInclude,
      });

      for (const item of cartItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              soldCount: { increment: item.quantity },
            },
          });
        }
      }

      if (dto.couponCode) {
        await tx.coupon.updateMany({
          where: { code: dto.couponCode.toUpperCase() },
          data: { usedCount: { increment: 1 } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId } });

      return created;
    });

    return this.serializeOrder(order);
  }

  async findAll(userId: string, role: Role, filters: OrderFilterDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const skip = getPaginationOffset(page, limit);

    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role);
    const where: Prisma.OrderWhereInput = isAdmin ? {} : { userId };
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: filters.sortOrder || 'desc' },
        include: {
          items: true,
          user: isAdmin
            ? { select: { id: true, email: true, firstName: true, lastName: true } }
            : false,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: items.map((o) => this.serializeOrder(o)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string, userId: string, role: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    if (!order) throw new NotFoundException('Order not found');

    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role);
    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.serializeOrder(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const updateData: Prisma.OrderUpdateInput = { status: dto.status };
    if (dto.trackingNumber) updateData.trackingNumber = dto.trackingNumber;

    if (dto.status === OrderStatus.SHIPPING) {
      updateData.shippedAt = new Date();
    } else if (dto.status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (dto.status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id },
        data: updateData,
        include: orderInclude,
      });

      await tx.orderTimeline.create({
        data: {
          orderId: id,
          status: dto.status,
          note: dto.note ?? `Status updated to ${dto.status}`,
        },
      });

      return result;
    });

    return this.serializeOrder(updated);
  }

  async getTimeline(id: string, userId: string, role: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role);
    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.orderTimeline.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'asc' },
    });
  }

  private serializeOrder(order: Record<string, unknown>) {
    const decimalFields = ['subtotal', 'discount', 'shippingCost', 'tax', 'total'];
    const serialized = { ...order } as Record<string, unknown>;
    for (const field of decimalFields) {
      if (serialized[field] !== undefined && serialized[field] !== null) {
        serialized[field] = Number(serialized[field]);
      }
    }
    if (Array.isArray(serialized.items)) {
      serialized.items = (serialized.items as Record<string, unknown>[]).map((item) => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
      }));
    }
    return serialized;
  }
}
