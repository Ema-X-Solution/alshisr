import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@CurrentUser('id') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.cartService.removeItem(userId, id);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
