'use client';

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageLoader } from '@/components/ui/loading';
import { ordersApi } from '@/lib/services';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_COLORS, ORDER_STATUSES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('orders');
  const tNav = useTranslations('nav');
  const tStatus = useTranslations('status');
  const { id } = use(params);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.get(id),
  });

  const { data: timeline = [] } = useQuery({
    queryKey: ['order-timeline', id],
    queryFn: () => ordersApi.getTimeline(id),
  });

  const updateMutation = useMutation({
    mutationFn: () => ordersApi.updateStatus(id, status, note, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['order-timeline', id] });
      toast({ title: t('statusUpdated') });
      setNote('');
    },
    onError: () => toast({ title: t('statusUpdateFailed'), variant: 'destructive' }),
  });

  if (isLoading) return <PageLoader />;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/orders' }, { label: `#${order.orderNumber}` }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('detailTitle')} #{order.orderNumber}</h2>
        <Badge className={ORDER_STATUS_COLORS[order.status]} variant="outline">{tStatus(order.status)}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Order Items</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku} × {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 border-t pt-4 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shippingCost)}</span></div>
                <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
                {timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium text-sm">{event.status.replace(/_/g, ' ')}</p>
                      {event.note && <p className="text-sm text-muted-foreground">{event.note}</p>}
                      <p className="text-xs text-muted-foreground">{formatDateTime(event.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              {order.user && (
                <>
                  <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
                  <p className="text-muted-foreground">{order.user.email}</p>
                </>
              )}
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader><CardTitle className="text-base">Shipping Address</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.phone}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">{t('updateStatus')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status || order.status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{tStatus(s)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tracking Number</Label>
                <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder={order.trackingNumber || ''} />
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note..." />
              </div>
              <Button className="w-full" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                {t('updateStatus')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
