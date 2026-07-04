import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPaginationMeta, getPaginationOffset } from '@alshisr/shared';
import { CreateReviewDto, ReviewFilterDto } from './reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.review.findUnique({
      where: { productId_userId: { productId: dto.productId, userId } },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    const deliveredOrder = await this.prisma.order.findFirst({
      where: {
        userId,
        status: 'DELIVERED',
        items: { some: { productId: dto.productId } },
      },
    });
    if (!deliveredOrder) {
      throw new BadRequestException('You can only review products from delivered orders');
    }

    const review = await this.prisma.review.create({
      data: {
        productId: dto.productId,
        userId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        isApproved: false,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    return review;
  }

  async findByProduct(productId: string, filters: ReviewFilterDto, adminView = false) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const skip = getPaginationOffset(page, limit);

    const where = {
      productId,
      ...(adminView ? {} : { isApproved: true }),
      ...(filters.rating ? { rating: filters.rating } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: filters.sortOrder || 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async approve(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.review.update({
        where: { id },
        data: { isApproved: true },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
      });

      const stats = await tx.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: true,
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating ?? 0,
          reviewCount: stats._count,
        },
      });

      return result;
    });

    return updated;
  }

  async findPending(filters: ReviewFilterDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const skip = getPaginationOffset(page, limit);

    const where = { isApproved: false };

    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          product: { select: { id: true, name: true, nameAr: true, slug: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }
}
