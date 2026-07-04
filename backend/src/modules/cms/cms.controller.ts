import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CmsService } from './cms.service';
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
import { Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private cmsService: CmsService) {}

  // Sliders
  @Public()
  @Get('sliders')
  @ApiOperation({ summary: 'List active sliders' })
  findSliders() {
    return this.cmsService.findSliders();
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get('admin/sliders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all sliders (admin)' })
  findAllSliders() {
    return this.cmsService.findSliders(false);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post('sliders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create slider (admin)' })
  createSlider(@Body() dto: CreateSliderDto) {
    return this.cmsService.createSlider(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch('sliders/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update slider (admin)' })
  updateSlider(@Param('id') id: string, @Body() dto: UpdateSliderDto) {
    return this.cmsService.updateSlider(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete('sliders/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete slider (admin)' })
  deleteSlider(@Param('id') id: string) {
    return this.cmsService.deleteSlider(id);
  }

  // Banners
  @Public()
  @Get('banners')
  @ApiOperation({ summary: 'List active banners' })
  findBanners(@Query('position') position?: string) {
    return this.cmsService.findBanners(position);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get('admin/banners')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all banners (admin)' })
  findAllBanners(@Query('position') position?: string) {
    return this.cmsService.findBanners(position, false);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post('banners')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create banner (admin)' })
  createBanner(@Body() dto: CreateBannerDto) {
    return this.cmsService.createBanner(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch('banners/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banner (admin)' })
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.cmsService.updateBanner(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete('banners/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete banner (admin)' })
  deleteBanner(@Param('id') id: string) {
    return this.cmsService.deleteBanner(id);
  }

  // Blogs
  @Public()
  @Get('blogs')
  @ApiOperation({ summary: 'List published blogs' })
  findBlogs(@Query() filters: CmsFilterDto) {
    return this.cmsService.findBlogs(filters);
  }

  @Public()
  @Get('blogs/slug/:slug')
  @ApiOperation({ summary: 'Get blog by slug' })
  findBlogBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBlogBySlug(slug);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get('admin/blogs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all blogs (admin)' })
  findAllBlogs(@Query() filters: CmsFilterDto) {
    return this.cmsService.findBlogs(filters, false);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post('blogs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog (admin)' })
  createBlog(@Body() dto: CreateBlogDto) {
    return this.cmsService.createBlog(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch('blogs/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog (admin)' })
  updateBlog(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.cmsService.updateBlog(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete('blogs/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog (admin)' })
  deleteBlog(@Param('id') id: string) {
    return this.cmsService.deleteBlog(id);
  }

  // Pages
  @Public()
  @Get('pages')
  @ApiOperation({ summary: 'List published pages' })
  findPages() {
    return this.cmsService.findPages();
  }

  @Public()
  @Get('pages/slug/:slug')
  @ApiOperation({ summary: 'Get page by slug' })
  findPageBySlug(@Param('slug') slug: string) {
    return this.cmsService.findPageBySlug(slug);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get('admin/pages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all pages (admin)' })
  findAllPages() {
    return this.cmsService.findPages(false);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post('pages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create page (admin)' })
  createPage(@Body() dto: CreatePageDto) {
    return this.cmsService.createPage(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch('pages/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update page (admin)' })
  updatePage(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.cmsService.updatePage(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete('pages/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete page (admin)' })
  deletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }

  // FAQs
  @Public()
  @Get('faqs')
  @ApiOperation({ summary: 'List active FAQs' })
  findFaqs(@Query('category') category?: string) {
    return this.cmsService.findFaqs(category);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get('admin/faqs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all FAQs (admin)' })
  findAllFaqs(@Query('category') category?: string) {
    return this.cmsService.findFaqs(category, false);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post('faqs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create FAQ (admin)' })
  createFaq(@Body() dto: CreateFaqDto) {
    return this.cmsService.createFaq(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch('faqs/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FAQ (admin)' })
  updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.cmsService.updateFaq(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete('faqs/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete FAQ (admin)' })
  deleteFaq(@Param('id') id: string) {
    return this.cmsService.deleteFaq(id);
  }

  // Testimonials
  @Public()
  @Get('testimonials')
  @ApiOperation({ summary: 'List active testimonials' })
  findTestimonials() {
    return this.cmsService.findTestimonials();
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get('admin/testimonials')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all testimonials (admin)' })
  findAllTestimonials() {
    return this.cmsService.findTestimonials(false);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post('testimonials')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create testimonial (admin)' })
  createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.cmsService.createTestimonial(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch('testimonials/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update testimonial (admin)' })
  updateTestimonial(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.cmsService.updateTestimonial(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete('testimonials/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete testimonial (admin)' })
  deleteTestimonial(@Param('id') id: string) {
    return this.cmsService.deleteTestimonial(id);
  }
}
