import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeNewsletterDto, UnsubscribeNewsletterDto } from './newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(dto: SubscribeNewsletterDto) {
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      if (existing.isActive) {
        return { message: 'Email is already subscribed' };
      }
      await this.prisma.newsletter.update({
        where: { email },
        data: { isActive: true },
      });
      return { message: 'Successfully resubscribed to newsletter' };
    }

    await this.prisma.newsletter.create({ data: { email } });
    return { message: 'Successfully subscribed to newsletter' };
  }

  async unsubscribe(dto: UnsubscribeNewsletterDto) {
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.newsletter.findUnique({ where: { email } });
    if (!existing || !existing.isActive) {
      return { message: 'Email is not subscribed' };
    }

    await this.prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return { message: 'Successfully unsubscribed from newsletter' };
  }
}
