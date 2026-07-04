'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useAuth } from '@/lib/hooks/useAuth';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const { isAuthenticated } = useAuth();
  const { items, isLoading } = useWishlist();

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
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">{t('empty')}</h1>
        <p className="mb-6 text-muted-foreground">{t('emptyText')}</p>
        <Button asChild><Link href="/shop">Shop</Link></Button>
      </div>
    );
  }

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <h1 className="font-display mb-8 text-4xl font-bold text-primary">{t('title')}</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <ProductCard key={item.id} product={item.product} index={index} />
        ))}
      </div>
    </div>
  );
}
