import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto, ToggleWishlistDto } from './wishlist.dto';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  getWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  addItem(@CurrentUser('id') userId: string, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(userId, dto);
  }

  @Post('toggle')
  @ApiOperation({ summary: 'Toggle product in wishlist' })
  toggle(@CurrentUser('id') userId: string, @Body() dto: ToggleWishlistDto) {
    return this.wishlistService.toggle(userId, dto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  removeItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(userId, productId);
  }
}
