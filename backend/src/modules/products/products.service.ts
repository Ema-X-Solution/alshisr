import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify, buildPaginationMeta, getPaginationOffset } from '@alshisr/shared';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
} from './products.dto';

const productInclude = {
  category: { select: { id: true, name: true, nameAr: true, slug: true } },
  brand: { select: { id: true, name: true, nameAr: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const } },
  variants: { where: { isActive: true } },
  attributes: true,
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: ProductFilterDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const skip = getPaginationOffset(page, limit);

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.brand) {
      where.brand = { slug: filters.brand };
    }
    if (filters.featured !== undefined) where.isFeatured = filters.featured;
    if (filters.bestSeller !== undefined) where.isBestSeller = filters.bestSeller;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { nameAr: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    const sortField = filters.sortBy || 'createdAt';
    const allowedSortFields = ['createdAt', 'price', 'name', 'soldCount', 'rating', 'viewCount'];
    if (allowedSortFields.includes(sortField)) {
      orderBy[sortField as keyof Prisma.ProductOrderByWithRelationInput] =
        filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: productInclude.category,
          brand: productInclude.brand,
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items.map((p) => this.serializeProduct(p)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.serializeProduct(product);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.serializeProduct(product);
  }

  async findRelated(idOrSlug: string, limit = 8) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!product) throw new NotFoundException('Product not found');

    const explicitRelated = await this.prisma.relatedProduct.findMany({
      where: { productId: product.id },
      include: {
        related: {
          include: {
            category: productInclude.category,
            brand: productInclude.brand,
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          },
        },
      },
      take: limit,
    });

    if (explicitRelated.length > 0) {
      return explicitRelated
        .map((r) => r.related)
        .filter((p) => p.isActive)
        .map((p) => this.serializeProduct(p));
    }

    const related = await this.prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          ...(product.brandId ? [{ brandId: product.brandId }] : []),
        ],
      },
      include: {
        category: productInclude.category,
        brand: productInclude.brand,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      orderBy: { soldCount: 'desc' },
      take: limit,
    });

    return related.map((p) => this.serializeProduct(p));
  }

  async create(dto: CreateProductDto) {
    await this.validateRelations(dto.categoryId, dto.brandId);
    const slug = await this.ensureUniqueSlug(dto.slug || slugify(dto.name));

    const existingSku = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
    if (existingSku) throw new ConflictException('SKU already exists');

    const { images, variants, attributes, relatedProductIds, ...productData } = dto;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        slug,
        hasVariants: dto.hasVariants ?? Boolean(variants?.length),
        images: images?.length
          ? { create: images }
          : undefined,
        variants: variants?.length
          ? { create: variants }
          : undefined,
        attributes: attributes?.length
          ? { create: attributes }
          : undefined,
      },
      include: productInclude,
    });

    if (relatedProductIds?.length) {
      await this.syncRelatedProducts(product.id, relatedProductIds);
    }

    return this.serializeProduct(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    if (dto.categoryId || dto.brandId) {
      await this.validateRelations(dto.categoryId ?? existing.categoryId, dto.brandId);
    }
    if (dto.sku && dto.sku !== existing.sku) {
      const skuExists = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
      if (skuExists) throw new ConflictException('SKU already exists');
    }

    const { images, variants, attributes, relatedProductIds, ...productData } = dto;
    let slug = dto.slug;
    if (dto.slug) {
      slug = await this.ensureUniqueSlug(dto.slug, id);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          ...productData,
          ...(slug ? { slug } : {}),
          ...(variants !== undefined
            ? { hasVariants: variants.length > 0 }
            : {}),
        },
      });

      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length) {
          await tx.productImage.createMany({
            data: images.map((img) => ({ ...img, productId: id })),
          });
        }
      }

      if (attributes !== undefined) {
        await tx.productAttribute.deleteMany({ where: { productId: id } });
        if (attributes.length) {
          await tx.productAttribute.createMany({
            data: attributes.map((attr) => ({ ...attr, productId: id })),
          });
        }
      }

      if (variants !== undefined) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        if (variants.length) {
          for (const variant of variants) {
            await tx.productVariant.create({
              data: { ...variant, productId: id },
            });
          }
        }
      }
    });

    if (relatedProductIds !== undefined) {
      await this.syncRelatedProducts(id, relatedProductIds);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  private async validateRelations(categoryId: string, brandId?: string | null) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new BadRequestException('Category not found');
    if (brandId) {
      const brand = await this.prisma.brand.findUnique({ where: { id: brandId } });
      if (!brand) throw new BadRequestException('Brand not found');
    }
  }

  private async syncRelatedProducts(productId: string, relatedIds: string[]) {
    const uniqueIds = [...new Set(relatedIds.filter((rid) => rid !== productId))];
    await this.prisma.relatedProduct.deleteMany({ where: { productId } });
    if (uniqueIds.length) {
      await this.prisma.relatedProduct.createMany({
        data: uniqueIds.map((relatedId) => ({ productId, relatedId })),
        skipDuplicates: true,
      });
    }
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.product.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) return slug;
      slug = `${baseSlug}-${counter++}`;
    }
  }

  private serializeProduct<T extends Record<string, unknown>>(product: T): T {
    const serialized = { ...product } as Record<string, unknown>;
    for (const key of ['price', 'compareAtPrice', 'costPrice', 'weight', 'rating']) {
      if (serialized[key] !== undefined && serialized[key] !== null) {
        serialized[key] = Number(serialized[key]);
      }
    }
    if (Array.isArray(serialized.variants)) {
      serialized.variants = (serialized.variants as Record<string, unknown>[]).map((v) => ({
        ...v,
        price: Number(v.price),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      }));
    }
    return serialized as T;
  }
}
