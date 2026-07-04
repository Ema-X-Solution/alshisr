'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const t = useTranslations('cart');
  const { isAuthenticated } = useAuth();
  const { items, subtotal, isLoading, updateItem, removeItem } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">{t('title')}</h1>
        <p className="mb-6 text-muted-foreground">Please login to view your cart</p>
        <Button asChild><Link href="/login">Login</Link></Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section-padding mx-auto max-w-7xl">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">{t('empty')}</h1>
        <p className="mb-6 text-muted-foreground">{t('emptyText')}</p>
        <Button asChild><Link href="/shop">{t('continueShopping')}</Link></Button>
      </div>
    );
  }

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <h1 className="font-display mb-8 text-4xl font-bold text-primary">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={(id, qty) => updateItem({ id, quantity: qty })}
              onRemove={(id) => removeItem(id)}
            />
          ))}
        </div>
        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
