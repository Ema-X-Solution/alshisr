'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { getProductImage, type CartItem } from '@/lib/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping?: number;
  discount?: number;
}

export function OrderSummary({ items, subtotal, shipping = 0, discount = 0 }: OrderSummaryProps) {
  const t = useTranslations('checkout');
  const { field, formatPrice } = useLocaleField();
  const total = subtotal + shipping - discount;

  return (
    <div className="rounded-sm border bg-card p-6">
      <h3 className="font-display mb-6 text-xl font-semibold">{t('orderSummary')}</h3>
      <div className="max-h-64 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-muted">
              <Image
                src={getProductImage(item.product)}
                alt={field(item.product, 'name')}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{field(item.product, 'name')}</p>
              <p className="text-xs text-muted-foreground">x{item.quantity}</p>
            </div>
            <p className="text-sm font-medium">
              {formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}
            </p>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {shipping > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
