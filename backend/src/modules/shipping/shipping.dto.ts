import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CalculateShippingDto {
  @ApiProperty({ example: 'OM' })
  @IsString()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  weight?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  orderTotal: number;
}

export class CreateShippingZoneDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() nameAr: string;
  @ApiProperty({ type: [String] }) @IsString({ each: true }) countries: string[];
  @ApiPropertyOptional() @IsOptional() isActive?: boolean;
}

export class CreateShippingRateDto {
  @ApiProperty() @IsString() zoneId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() nameAr: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() minWeight?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() maxWeight?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() minOrder?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() maxOrder?: number;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) price: number;
  @ApiPropertyOptional() @IsOptional() isActive?: boolean;
}
