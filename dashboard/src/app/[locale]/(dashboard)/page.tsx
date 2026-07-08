'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { OrderStatusChart } from '@/components/dashboard/OrderStatusChart';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { PageLoader } from '@/components/ui/loading';
import { adminApi } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminApi.getDashboard,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: () => adminApi.getAnalytics('30d'),
  });

  if (statsLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground">{t('welcome')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('totalRevenue')}
          value={formatCurrency(stats?.revenue.total || 0)}
          description={t('thisMonth', { amount: formatCurrency(stats?.revenue.thisMonth || 0) })}
          icon={DollarSign}
        />
        <StatCard
          title={t('orders')}
          value={stats?.orders.total || 0}
          description={t('ordersMeta', {
            today: stats?.orders.today || 0,
            pending: stats?.orders.pending || 0,
          })}
          icon={ShoppingCart}
        />
        <StatCard
          title={t('customers')}
          value={stats?.customers || 0}
          icon={Users}
        />
        <StatCard
          title={t('products')}
          value={stats?.products || 0}
          description={t('lowStock', { count: stats?.lowStockProducts || 0 })}
          icon={Package}
        />
      </div>

      {!analyticsLoading && analytics && (
        <div className="grid gap-4 lg:grid-cols-2">
          <RevenueChart data={analytics.revenueByDay} />
          <OrdersChart data={analytics.revenueByDay} />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {!analyticsLoading && analytics && (
          <div className="lg:col-span-1">
            <OrderStatusChart data={analytics.orderStatusBreakdown} />
          </div>
        )}
        <div className="lg:col-span-2">
          <RecentOrders orders={stats?.recentOrders || []} />
        </div>
      </div>
    </div>
  );
}
