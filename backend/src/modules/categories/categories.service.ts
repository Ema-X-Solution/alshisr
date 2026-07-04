import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '@alshisr/shared';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    const categories = await this.prisma.category.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        children: {
          where: includeInactive ? undefined : { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
        _count: { select: { products: true } },
      },
    });

    return categories.map(({ _count, ...category }) => ({
      ...category,
      productsCount: _count.products,
    }));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        _count: { select: { products: true } },
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    const { _count, ...rest } = category;
    return { ...rest, productsCount: _count.products };
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        _count: { select: { products: true } },
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    const { _count, ...rest } = category;
    return { ...rest, productsCount: _count.products };
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new BadRequestException('Parent category not found');
    }
    const slug = await this.ensureUniqueSlug(dto.slug || slugify(dto.name));
    return this.prisma.category.create({
      data: { ...dto, slug },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new BadRequestException('Parent category not found');
    }
    const data = { ...dto };
    if (dto.slug) {
      data.slug = await this.ensureUniqueSlug(dto.slug, id);
    }
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    const [productCount, childCount] = await Promise.all([
      this.prisma.product.count({ where: { categoryId: id } }),
      this.prisma.category.count({ where: { parentId: id } }),
    ]);
    if (productCount > 0) {
      throw new ConflictException('Cannot delete category with associated products');
    }
    if (childCount > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.category.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) return slug;
      slug = `${baseSlug}-${counter++}`;
    }
  }
}
