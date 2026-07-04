import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPaginationMeta, getPaginationOffset } from '@alshisr/shared';
import { SubmitContactDto, ContactFilterDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async submit(dto: SubmitContactDto) {
    const message = await this.prisma.contactMessage.create({ data: dto });
    return {
      message: 'Your message has been sent successfully',
      id: message.id,
    };
  }

  async findAll(filters: ContactFilterDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = getPaginationOffset(page, limit);

    const where = filters.unreadOnly ? { isRead: false } : {};

    const [items, total, unreadCount] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: filters.sortOrder || 'desc' },
      }),
      this.prisma.contactMessage.count({ where }),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    return {
      data: items,
      unreadCount,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async markAsRead(id: string) {
    const message = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');

    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
