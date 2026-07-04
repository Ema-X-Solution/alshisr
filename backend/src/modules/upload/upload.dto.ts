import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteImageDto {
  @ApiProperty({ description: 'Cloudinary public ID or full URL' })
  @IsString()
  publicId: string;

  @ApiPropertyOptional({ description: 'Resource type', default: 'image' })
  @IsOptional()
  @IsString()
  resourceType?: string;
}
