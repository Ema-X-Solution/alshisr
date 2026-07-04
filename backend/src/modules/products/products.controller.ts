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
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
} from './products.dto';
import { Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List products with pagination and filters' })
  findAll(@Query() filters: ProductFilterDto) {
    return this.productsService.findAll(filters);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get('slug/:slug/related')
  @ApiOperation({ summary: 'Get related products by slug' })
  findRelatedBySlug(@Param('slug') slug: string) {
    return this.productsService.findRelated(slug);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products by ID' })
  findRelated(@Param('id') id: string) {
    return this.productsService.findRelated(id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product (admin)' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (admin)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
