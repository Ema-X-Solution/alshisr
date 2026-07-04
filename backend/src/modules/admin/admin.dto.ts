import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ enum: ['7d', '30d', '90d', '365d'], default: '30d' })
  @IsOptional()
  @IsIn(['7d', '30d', '90d', '365d'])
  period?: string;
}
