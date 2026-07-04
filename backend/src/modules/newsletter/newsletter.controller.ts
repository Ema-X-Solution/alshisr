import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto, UnsubscribeNewsletterDto } from './newsletter.dto';
import { Public } from '../../common/decorators';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}

  @Public()
  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  subscribe(@Body() dto: SubscribeNewsletterDto) {
    return this.newsletterService.subscribe(dto);
  }

  @Public()
  @Post('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  unsubscribe(@Body() dto: UnsubscribeNewsletterDto) {
    return this.newsletterService.unsubscribe(dto);
  }
}
