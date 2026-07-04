import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeNewsletterDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class UnsubscribeNewsletterDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
