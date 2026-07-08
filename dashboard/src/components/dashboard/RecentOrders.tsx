'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_COLORS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import type { RecentOrder } from '@/lib/types';

interface RecentOrdersProps {
  orders: RecentOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('status');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t('recentOrders')}</CardTitle>
        <Link href="/orders" className="text-sm text-primary hover:underline">
          {tCommon('viewAll')}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t('noOrdersYet')}</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <Link href={`/orders/${order.id}`} className="font-medium text-sm hover:text-primary">
                    #{order.orderNumber}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="text-end">
                  <p className="font-medium text-sm">{formatCurrency(order.total)}</p>
                  <Badge className={ORDER_STATUS_COLORS[order.status] || ''} variant="outline">
                    {tStatus.has(order.status as 'PENDING')
                      ? tStatus(order.status as 'PENDING')
                      : order.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
