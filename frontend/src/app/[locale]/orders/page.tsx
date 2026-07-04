'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ordersApi } from '@/lib/api/orders';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import type { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersPage() {
  const t = useTranslations('orders');
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useLocaleField();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => ordersApi.getAll(page, 10),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <Button asChild><Link href="/login">Login</Link></Button>
      </div>
    );
  }

  const orders = data?.data ?? [];

  return (
    <div className="section-padding mx-auto max-w-4xl">
      <h1 className="font-display mb-8 text-4xl font-bold text-primary">{t('title')}</h1>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : !orders.length ? (
        <p className="text-center text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-sm border p-4">
              <div>
                <p className="font-medium">{t('orderNumber')}: {order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} · {formatPrice(order.total)}
                </p>
              </div>
              <Badge variant="secondary">{t(`statuses.${order.status}`)}</Badge>
              <Button asChild variant="outline" size="sm">
                <Link href={`/orders/${order.id}`}>{t('viewDetails')}</Link>
              </Button>
            </div>
          ))}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" disabled={!data.meta.hasPrevPage} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" disabled={!data.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
