import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}

export class InitiateMyFatoorahDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  callbackUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errorUrl?: string;
}

export class ConfirmCodDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}
