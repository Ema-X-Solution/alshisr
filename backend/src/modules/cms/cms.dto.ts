import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsUrl,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

// Slider DTOs
export class CreateSliderDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() titleAr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitleAr?: string;
  @ApiProperty() @IsUrl() image: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() mobileImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() link?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() buttonText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() buttonTextAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) sortOrder?: number;
}
export class UpdateSliderDto extends PartialType(CreateSliderDto) {}

// Banner DTOs
export class CreateBannerDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() titleAr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitleAr?: string;
  @ApiProperty() @IsUrl() image: string;
  @ApiPropertyOptional() @IsOptional() @IsString() link?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() position?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) sortOrder?: number;
}
export class UpdateBannerDto extends PartialType(CreateBannerDto) {}

// Blog DTOs
export class CreateBlogDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() titleAr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerpt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerptAr?: string;
  @ApiProperty() @IsString() content: string;
  @ApiProperty() @IsString() contentAr: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() image?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() author?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

// Page DTOs
export class CreatePageDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() titleAr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiProperty() @IsString() content: string;
  @ApiProperty() @IsString() contentAr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
}
export class UpdatePageDto extends PartialType(CreatePageDto) {}

// FAQ DTOs
export class CreateFaqDto {
  @ApiProperty() @IsString() question: string;
  @ApiProperty() @IsString() questionAr: string;
  @ApiProperty() @IsString() answer: string;
  @ApiProperty() @IsString() answerAr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) sortOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateFaqDto extends PartialType(CreateFaqDto) {}

// Testimonial DTOs
export class CreateTestimonialDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roleAr?: string;
  @ApiProperty() @IsString() content: string;
  @ApiProperty() @IsString() contentAr: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() avatar?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) rating?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) sortOrder?: number;
}
export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}

export class CmsFilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
}

export class PublishBlogDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
