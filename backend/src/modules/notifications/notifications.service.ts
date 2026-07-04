import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPaginationMeta, getPaginationOffset } from '@alshisr/shared';
import { NotificationFilterDto } from './notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters: NotificationFilterDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = getPaginationOffset(page, limit);

    const where = {
      userId,
      ...(filters.unreadOnly ? { isRead: false } : {}),
    };

    const [items, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      data: items,
      unreadCount,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { message: 'All notifications marked as read', count: result.count };
  }

  async create(data: {
    userId: string;
    title: string;
    titleAr?: string;
    message: string;
    messageAr?: string;
    type?: string;
    link?: string;
  }) {
    return this.prisma.notification.create({ data });
  }
}
