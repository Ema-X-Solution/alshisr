import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddWishlistItemDto {
  @ApiProperty()
  @IsString()
  productId: string;
}

export class ToggleWishlistDto {
  @ApiProperty()
  @IsString()
  productId: string;
}
