'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLocaleField } from '@/lib/hooks/useLocaleField';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  discount?: number;
  showCheckout?: boolean;
}

export function CartSummary({
  subtotal,
  shipping = 0,
  discount = 0,
  showCheckout = true,
}: CartSummaryProps) {
  const t = useTranslations('cart');
  const { formatPrice } = useLocaleField();
  const total = subtotal + shipping - discount;

  return (
    <div className="rounded-sm border bg-card p-6">
      <h3 className="font-display mb-6 text-xl font-semibold">{t('title')}</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {shipping > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('shipping')}</span>
            <span>{formatPrice(shipping)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>{t('discount')}</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      <Separator className="my-4" />
      <div className="mb-6 flex justify-between text-lg font-semibold">
        <span>{t('total')}</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>
      {showCheckout && (
        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">{t('checkout')}</Link>
        </Button>
      )}
    </div>
  );
}
