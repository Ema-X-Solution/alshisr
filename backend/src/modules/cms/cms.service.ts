import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify, buildPaginationMeta, getPaginationOffset } from '@alshisr/shared';
import {
  CreateSliderDto,
  UpdateSliderDto,
  CreateBannerDto,
  UpdateBannerDto,
  CreateBlogDto,
  UpdateBlogDto,
  CreatePageDto,
  UpdatePageDto,
  CreateFaqDto,
  UpdateFaqDto,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  CmsFilterDto,
} from './cms.dto';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // ==================== SLIDERS ====================
  findSliders(activeOnly = true) {
    return this.prisma.slider.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  findSlider(id: string) {
    return this.findOrThrow(this.prisma.slider, id, 'Slider');
  }

  createSlider(dto: CreateSliderDto) {
    return this.prisma.slider.create({ data: dto });
  }

  updateSlider(id: string, dto: UpdateSliderDto) {
    return this.findSlider(id).then(() =>
      this.prisma.slider.update({ where: { id }, data: dto }),
    );
  }

  deleteSlider(id: string) {
    return this.findSlider(id).then(() =>
      this.prisma.slider.delete({ where: { id } }).then(() => ({ message: 'Slider deleted' })),
    );
  }

  // ==================== BANNERS ====================
  findBanners(position?: string, activeOnly = true) {
    return this.prisma.banner.findMany({
      where: {
        ...(activeOnly ? { isActive: true } : {}),
        ...(position ? { position } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  findBanner(id: string) {
    return this.findOrThrow(this.prisma.banner, id, 'Banner');
  }

  createBanner(dto: CreateBannerDto) {
    return this.prisma.banner.create({ data: dto });
  }

  updateBanner(id: string, dto: UpdateBannerDto) {
    return this.findBanner(id).then(() =>
      this.prisma.banner.update({ where: { id }, data: dto }),
    );
  }

  deleteBanner(id: string) {
    return this.findBanner(id).then(() =>
      this.prisma.banner.delete({ where: { id } }).then(() => ({ message: 'Banner deleted' })),
    );
  }

  // ==================== BLOGS ====================
  async findBlogs(filters: CmsFilterDto, publishedOnly = true) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const skip = getPaginationOffset(page, limit);

    const where = {
      ...(publishedOnly ? { isPublished: true } : {}),
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' as const } },
              { titleAr: { contains: filters.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: filters.sortOrder || 'desc' },
      }),
      this.prisma.blog.count({ where }),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findBlogBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({ where: { slug } });
    if (!blog || !blog.isPublished) throw new NotFoundException('Blog not found');
    await this.prisma.blog.update({
      where: { id: blog.id },
      data: { viewCount: { increment: 1 } },
    });
    return blog;
  }

  findBlog(id: string) {
    return this.findOrThrow(this.prisma.blog, id, 'Blog');
  }

  async createBlog(dto: CreateBlogDto) {
    const slug = await this.ensureUniqueSlug(
      this.prisma.blog,
      dto.slug || slugify(dto.title),
    );
    return this.prisma.blog.create({
      data: {
        ...dto,
        slug,
        publishedAt: dto.isPublished ? new Date() : undefined,
      },
    });
  }

  async updateBlog(id: string, dto: UpdateBlogDto) {
    await this.findBlog(id);
    let slug: string | undefined;
    if (dto.slug) slug = await this.ensureUniqueSlug(this.prisma.blog, dto.slug, id);
    if (dto.title && dto.isPublished && !dto.slug) {
      const existing = await this.prisma.blog.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        dto.isPublished = true;
      }
    }
    return this.prisma.blog.update({
      where: { id },
      data: {
        ...dto,
        ...(slug ? { slug } : {}),
        ...(dto.isPublished ? { publishedAt: new Date() } : {}),
      },
    });
  }

  deleteBlog(id: string) {
    return this.findBlog(id).then(() =>
      this.prisma.blog.delete({ where: { id } }).then(() => ({ message: 'Blog deleted' })),
    );
  }

  // ==================== PAGES ====================
  findPages(publishedOnly = true) {
    return this.prisma.page.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { title: 'asc' },
    });
  }

  async findPageBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({ where: { slug } });
    if (!page || !page.isPublished) throw new NotFoundException('Page not found');
    return page;
  }

  findPage(id: string) {
    return this.findOrThrow(this.prisma.page, id, 'Page');
  }

  async createPage(dto: CreatePageDto) {
    const slug = await this.ensureUniqueSlug(
      this.prisma.page,
      dto.slug || slugify(dto.title),
    );
    return this.prisma.page.create({ data: { ...dto, slug } });
  }

  async updatePage(id: string, dto: UpdatePageDto) {
    await this.findPage(id);
    let slug: string | undefined;
    if (dto.slug) slug = await this.ensureUniqueSlug(this.prisma.page, dto.slug, id);
    return this.prisma.page.update({
      where: { id },
      data: { ...dto, ...(slug ? { slug } : {}) },
    });
  }

  deletePage(id: string) {
    return this.findPage(id).then(() =>
      this.prisma.page.delete({ where: { id } }).then(() => ({ message: 'Page deleted' })),
    );
  }

  // ==================== FAQS ====================
  findFaqs(category?: string, activeOnly = true) {
    return this.prisma.faq.findMany({
      where: {
        ...(activeOnly ? { isActive: true } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  findFaq(id: string) {
    return this.findOrThrow(this.prisma.faq, id, 'FAQ');
  }

  createFaq(dto: CreateFaqDto) {
    return this.prisma.faq.create({ data: dto });
  }

  updateFaq(id: string, dto: UpdateFaqDto) {
    return this.findFaq(id).then(() =>
      this.prisma.faq.update({ where: { id }, data: dto }),
    );
  }

  deleteFaq(id: string) {
    return this.findFaq(id).then(() =>
      this.prisma.faq.delete({ where: { id } }).then(() => ({ message: 'FAQ deleted' })),
    );
  }

  // ==================== TESTIMONIALS ====================
  findTestimonials(activeOnly = true) {
    return this.prisma.testimonial.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  findTestimonial(id: string) {
    return this.findOrThrow(this.prisma.testimonial, id, 'Testimonial');
  }

  createTestimonial(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data: dto });
  }

  updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    return this.findTestimonial(id).then(() =>
      this.prisma.testimonial.update({ where: { id }, data: dto }),
    );
  }

  deleteTestimonial(id: string) {
    return this.findTestimonial(id).then(() =>
      this.prisma.testimonial
        .delete({ where: { id } })
        .then(() => ({ message: 'Testimonial deleted' })),
    );
  }

  private async findOrThrow<T extends { findUnique: (args: { where: { id: string } }) => Promise<unknown> }>(
    model: T,
    id: string,
    label: string,
  ) {
    const item = await model.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`${label} not found`);
    return item;
  }

  private async ensureUniqueSlug(
    model: { findUnique: (args: { where: { slug: string } }) => Promise<{ id: string } | null> },
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await model.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) return slug;
      slug = `${baseSlug}-${counter++}`;
    }
  }
}
