import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CalculateShippingDto } from './shipping.dto';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async findZones(activeOnly = true) {
    return this.prisma.shippingZone.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      include: {
        rates: {
          where: activeOnly ? { isActive: true } : undefined,
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    }).then((zones) =>
      zones.map((zone) => ({
        ...zone,
        rates: zone.rates.map((rate) => ({
          ...rate,
          minWeight: rate.minWeight ? Number(rate.minWeight) : null,
          maxWeight: rate.maxWeight ? Number(rate.maxWeight) : null,
          minOrder: rate.minOrder ? Number(rate.minOrder) : null,
          maxOrder: rate.maxOrder ? Number(rate.maxOrder) : null,
          price: Number(rate.price),
        })),
      })),
    );
  }

  async calculateShipping(dto: CalculateShippingDto) {
    const zones = await this.prisma.shippingZone.findMany({
      where: { isActive: true, countries: { has: dto.country } },
      include: {
        rates: { where: { isActive: true }, orderBy: { price: 'asc' } },
      },
    });

    if (!zones.length) {
      throw new BadRequestException(`No shipping available for country: ${dto.country}`);
    }

    const matchingRates: Array<{
      zoneId: string;
      zoneName: string;
      rateId: string;
      rateName: string;
      price: number;
    }> = [];

    for (const zone of zones) {
      for (const rate of zone.rates) {
        if (dto.weight !== undefined) {
          if (rate.minWeight && dto.weight < Number(rate.minWeight)) continue;
          if (rate.maxWeight && dto.weight > Number(rate.maxWeight)) continue;
        }
        if (rate.minOrder && dto.orderTotal < Number(rate.minOrder)) continue;
        if (rate.maxOrder && dto.orderTotal > Number(rate.maxOrder)) continue;

        matchingRates.push({
          zoneId: zone.id,
          zoneName: zone.name,
          rateId: rate.id,
          rateName: rate.name,
          price: Number(rate.price),
        });
      }
    }

    if (!matchingRates.length) {
      throw new BadRequestException('No shipping rates match the provided criteria');
    }

    matchingRates.sort((a, b) => a.price - b.price);

    return {
      country: dto.country,
      options: matchingRates,
      cheapest: matchingRates[0],
    };
  }

  async findRate(id: string) {
    const rate = await this.prisma.shippingRate.findUnique({
      where: { id },
      include: { zone: true },
    });
    if (!rate) throw new NotFoundException('Shipping rate not found');
    return {
      ...rate,
      price: Number(rate.price),
      minWeight: rate.minWeight ? Number(rate.minWeight) : null,
      maxWeight: rate.maxWeight ? Number(rate.maxWeight) : null,
      minOrder: rate.minOrder ? Number(rate.minOrder) : null,
      maxOrder: rate.maxOrder ? Number(rate.maxOrder) : null,
    };
  }
}
