import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderFilterDto,
} from './orders.dto';
import { CurrentUser, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List orders (user or admin)' })
  findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Query() filters: OrderFilterDto,
  ) {
    return this.ordersService.findAll(userId, role as never, filters);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get order timeline' })
  getTimeline(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.ordersService.getTimeline(id, userId, role as never);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.ordersService.findOne(id, userId, role as never);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
