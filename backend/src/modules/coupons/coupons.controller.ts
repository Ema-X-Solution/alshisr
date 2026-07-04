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
import { CouponsService } from './coupons.service';
import {
  ValidateCouponDto,
  CreateCouponDto,
  UpdateCouponDto,
} from './coupons.dto';
import { Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Public()
  @Post('validate')
  @ApiOperation({ summary: 'Validate coupon code' })
  validate(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validate(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all coupons (admin)' })
  findAll() {
    return this.couponsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupon by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create coupon (admin)' })
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update coupon (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete coupon (admin)' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
