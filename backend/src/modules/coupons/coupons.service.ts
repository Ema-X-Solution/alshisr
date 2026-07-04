import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ValidateCouponDto,
  CreateCouponDto,
  UpdateCouponDto,
} from './coupons.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) throw new BadRequestException('Invalid coupon code');
    if (!coupon.isActive) throw new BadRequestException('Coupon is inactive');

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException('Coupon is not yet active');
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new BadRequestException('Coupon has expired');
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order amount of ${Number(coupon.minOrderAmount)} required`,
      );
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderAmount * Number(coupon.value)) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      discount = Number(coupon.value);
    }

    discount = Math.min(discount, orderAmount);
    discount = Math.round(discount * 100) / 100;

    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discount,
      finalAmount: Math.round((orderAmount - discount) * 100) / 100,
    };
  }

  async validate(dto: ValidateCouponDto) {
    return this.validateCoupon(dto.code, dto.orderAmount);
  }

  async findAll() {
    const coupons = await this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return coupons.map((c) => this.serializeCoupon(c));
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return this.serializeCoupon(coupon);
  }

  async create(dto: CreateCouponDto) {
    const code = dto.code.toUpperCase();
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) throw new ConflictException('Coupon code already exists');

    if (dto.type === 'percentage' && dto.value > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100');
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        ...dto,
        code,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });

    return this.serializeCoupon(coupon);
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.findOne(id);

    if (dto.type === 'percentage' && dto.value !== undefined && dto.value > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100');
    }

    if (dto.code) {
      const existing = await this.prisma.coupon.findFirst({
        where: { code: dto.code.toUpperCase(), NOT: { id } },
      });
      if (existing) throw new ConflictException('Coupon code already exists');
    }

    const coupon = await this.prisma.coupon.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.code ? { code: dto.code.toUpperCase() } : {}),
        ...(dto.startsAt ? { startsAt: new Date(dto.startsAt) } : {}),
        ...(dto.expiresAt ? { expiresAt: new Date(dto.expiresAt) } : {}),
      },
    });

    return this.serializeCoupon(coupon);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.coupon.delete({ where: { id } });
    return { message: 'Coupon deleted successfully' };
  }

  private serializeCoupon(coupon: Record<string, unknown>) {
    return {
      ...coupon,
      value: Number(coupon.value),
      minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    };
  }
}
