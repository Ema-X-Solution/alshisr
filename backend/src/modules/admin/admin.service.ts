import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueAgg,
      monthRevenueAgg,
      todayOrders,
      pendingOrders,
      recentOrders,
      lowStockCount,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: {
          paymentStatus: PaymentStatus.PAID,
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),
      this.prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.order.count({
        where: { status: { in: [OrderStatus.PENDING, OrderStatus.PROCESSING] } },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count FROM products
        WHERE "isActive" = true AND stock <= "lowStockThreshold"
      `,
    ]);

    return {
      revenue: {
        total: Number(revenueAgg._sum.total ?? 0),
        thisMonth: Number(monthRevenueAgg._sum.total ?? 0),
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        pending: pendingOrders,
      },
      customers: totalCustomers,
      products: totalProducts,
      lowStockProducts: Number(lowStockCount[0]?.count ?? 0),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        createdAt: o.createdAt,
        customer: o.user,
      })),
    };
  }

  async getAnalytics(period = '30d') {
    const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[period] ?? 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [orders, orderStatusBreakdown, topProducts, revenueByDay] = await Promise.all([
      this.prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          id: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId', 'name'],
        where: { order: { createdAt: { gte: startDate } } },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
      this.prisma.$queryRaw<Array<{ date: string; revenue: number; orders: number }>>`
        SELECT
          DATE("createdAt") as date,
          COALESCE(SUM(CASE WHEN "paymentStatus" = 'PAID' THEN total ELSE 0 END), 0)::float as revenue,
          COUNT(*)::int as orders
        FROM orders
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ]);

    const paidOrders = orders.filter((o) => o.paymentStatus === PaymentStatus.PAID);
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const averageOrderValue = paidOrders.length
      ? totalRevenue / paidOrders.length
      : 0;

    return {
      period,
      summary: {
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      },
      orderStatusBreakdown: orderStatusBreakdown.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      topProducts: topProducts.map((p) => ({
        productId: p.productId,
        name: p.name,
        quantitySold: p._sum.quantity ?? 0,
        revenue: Number(p._sum.total ?? 0),
      })),
      revenueByDay,
    };
  }
}
