import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '@alshisr/shared';
import { CreateBrandDto, UpdateBrandDto } from './brands.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    const brands = await this.prisma.brand.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: true } },
      },
    });

    return brands.map(({ _count, ...brand }) => ({
      ...brand,
      productsCount: _count.products,
    }));
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({ where: { slug } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async create(dto: CreateBrandDto) {
    const slug = await this.ensureUniqueSlug(dto.slug || slugify(dto.name));
    try {
      return await this.prisma.brand.create({
        data: { ...dto, slug },
      });
    } catch {
      throw new ConflictException('Brand with this slug already exists');
    }
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);
    const data = { ...dto };
    if (dto.slug) {
      data.slug = await this.ensureUniqueSlug(dto.slug, id);
    }
    return this.prisma.brand.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    const productCount = await this.prisma.product.count({ where: { brandId: id } });
    if (productCount > 0) {
      throw new ConflictException('Cannot delete brand with associated products');
    }
    await this.prisma.brand.delete({ where: { id } });
    return { message: 'Brand deleted successfully' };
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.brand.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) return slug;
      slug = `${baseSlug}-${counter++}`;
    }
  }
}
