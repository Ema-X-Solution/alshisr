import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAllGrouped() {
    const settings = await this.prisma.setting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    const grouped: Record<string, Record<string, { value: unknown; type: string }>> = {};
    for (const setting of settings) {
      if (!grouped[setting.group]) grouped[setting.group] = {};
      grouped[setting.group][setting.key] = {
        value: this.parseValue(setting.value, setting.type),
        type: setting.type,
      };
    }

    return grouped;
  }

  async findPublicSettings() {
    const publicGroups = ['general', 'store', 'social', 'seo', 'colors'];
    const settings = await this.prisma.setting.findMany({
      where: { group: { in: publicGroups } },
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    const grouped: Record<string, Record<string, unknown>> = {};
    for (const setting of settings) {
      if (!grouped[setting.group]) grouped[setting.group] = {};
      grouped[setting.group][setting.key] = this.parseValue(setting.value, setting.type);
    }

    return grouped;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    await this.prisma.$transaction(
      dto.settings.map((item) =>
        this.prisma.setting.upsert({
          where: { group_key: { group: item.group, key: item.key } },
          create: {
            group: item.group,
            key: item.key,
            value: item.value,
            type: item.type ?? 'string',
          },
          update: {
            value: item.value,
            ...(item.type ? { type: item.type } : {}),
          },
        }),
      ),
    );

    return this.findAllGrouped();
  }

  private parseValue(value: string, type: string): unknown {
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true';
      case 'json':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  }
}
