import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './brands.dto';
import { Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active brands' })
  findAll() {
    return this.brandsService.findAll();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get brand by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create brand (admin)' })
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update brand (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete brand (admin)' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
