'use client';

import { useQuery } from '@tanstack/react-query';
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
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to AL SHISR admin panel</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.revenue.total || 0)}
          description={`${formatCurrency(stats?.revenue.thisMonth || 0)} this month`}
          icon={DollarSign}
        />
        <StatCard
          title="Orders"
          value={stats?.orders.total || 0}
          description={`${stats?.orders.today || 0} today · ${stats?.orders.pending || 0} pending`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Customers"
          value={stats?.customers || 0}
          icon={Users}
        />
        <StatCard
          title="Products"
          value={stats?.products || 0}
          description={`${stats?.lowStockProducts || 0} low stock`}
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
