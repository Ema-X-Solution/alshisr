import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateSettingItemDto {
  @ApiProperty()
  @IsString()
  group: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiPropertyOptional({ default: 'string' })
  @IsOptional()
  @IsString()
  type?: string;
}

export class UpdateSettingsDto {
  @ApiProperty({ type: [UpdateSettingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSettingItemDto)
  settings: UpdateSettingItemDto[];
}
