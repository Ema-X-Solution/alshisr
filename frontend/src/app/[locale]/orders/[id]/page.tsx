'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ordersApi } from '@/lib/api/orders';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('orders');
  const { isAuthenticated } = useAuth();
  const { field, formatPrice } = useLocaleField();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id),
    enabled: isAuthenticated && !!id,
  });

  if (!isAuthenticated) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <Button asChild><Link href="/login">Login</Link></Button>
      </div>
    );
  }

  if (isLoading) return <div className="section-padding mx-auto max-w-3xl"><Skeleton className="h-96" /></div>;
  if (!order) return null;

  return (
    <div className="section-padding mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">{t('orderNumber')}</h1>
          <p className="text-lg">{order.orderNumber}</p>
        </div>
        <Badge>{t(`statuses.${order.status}`)}</Badge>
      </div>

      <div className="space-y-6 rounded-sm border p-6">
        <div>
          <h2 className="font-display mb-4 text-lg font-semibold">{t('items')}</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div>
                <p className="font-medium">{field(item, 'name')}</p>
                <p className="text-sm text-muted-foreground">x{item.quantity}</p>
              </div>
              <p>{formatPrice(item.total)}</p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingCost)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>
          )}
          <div className="flex justify-between text-lg font-semibold"><span>{t('total')}</span><span className="text-primary">{formatPrice(order.total)}</span></div>
        </div>
        {order.trackingNumber && (
          <p className="text-sm">{t('trackingNumber')}: {order.trackingNumber}</p>
        )}
      </div>

      {order.timeline && order.timeline.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display mb-4 text-lg font-semibold">{t('timeline')}</h2>
          <div className="space-y-4 border-s-2 border-secondary ps-6">
            {order.timeline.map((event) => (
              <div key={event.id}>
                <p className="font-medium">{t(`statuses.${event.status}`)}</p>
                <p className="text-sm text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p>
                {event.note && <p className="text-sm">{event.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
