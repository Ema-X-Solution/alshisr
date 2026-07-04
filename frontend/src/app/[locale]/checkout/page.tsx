'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const { isAuthenticated } = useAuth();
  const { items, subtotal, isLoading } = useCart();
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);

  if (!isAuthenticated) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">{t('title')}</h1>
        <Button asChild><Link href="/login">Login</Link></Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section-padding mx-auto max-w-7xl">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <p className="mb-6 text-muted-foreground">Your cart is empty</p>
        <Button asChild><Link href="/shop">Shop</Link></Button>
      </div>
    );
  }

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <h1 className="font-display mb-8 text-4xl font-bold text-primary">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm
            subtotal={subtotal}
            onShippingChange={setShipping}
            onDiscountChange={setDiscount}
          />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary items={items} subtotal={subtotal} shipping={shipping} discount={discount} />
        </div>
      </div>
    </div>
  );
}
