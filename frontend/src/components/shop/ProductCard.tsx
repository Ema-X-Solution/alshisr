'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Price, ComparePrice } from '@/components/shared/Price';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { getDiscountPercent, getProductImage, type Product } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const t = useTranslations('product');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { toast } = useToast();
  const { field } = useLocaleField();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggle, isToggling } = useWishlist();
  const { addItem, isAdding } = useCart();
  const name = field(product, 'name');
  const image = getProductImage(product);
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;
  const needsVariant = product.hasVariants && (product.variants?.length ?? 0) > 0;

  const requireAuth = () => {
    toast({ title: tCommon('loginRequired') });
    router.push('/login');
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    if (needsVariant) {
      router.push(`/shop/${product.slug}`);
      return;
    }

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    await addItem({ productId: product.id, quantity: 1 });
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    await toggle(product.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn('group relative', className)}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute start-2 top-2 bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground sm:start-3 sm:top-3 sm:px-2 sm:text-xs">
              {t('discount', { percent: discount })}
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="absolute end-2 top-2 px-1.5 py-0.5 text-[10px] sm:end-3 sm:top-3 sm:px-2 sm:text-xs" variant="default">
              Best Seller
            </Badge>
          )}
        </div>
        <div className="mt-2 space-y-0.5 sm:mt-4 sm:space-y-1">
          {product.category && (
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
              {field(product.category, 'name')}
            </p>
          )}
          <h3 className="font-display text-sm font-medium leading-snug group-hover:text-primary sm:text-lg sm:leading-tight">
            {name}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Price amount={product.price} size="sm" className="sm:text-base" />
            {discount > 0 && product.compareAtPrice != null && (
              <ComparePrice amount={product.compareAtPrice} />
            )}
          </div>
        </div>
      </Link>

      <div className="mt-2 flex gap-2 sm:mt-3">
        <Button
          size="sm"
          className="min-w-0 flex-1"
          disabled={outOfStock || isAdding}
          onClick={handleAddToCart}
        >
          <FiShoppingBag className="h-4 w-4 shrink-0" />
          <span className="truncate">{outOfStock ? t('outOfStock') : t('addToCart')}</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 px-3"
          disabled={isToggling}
          onClick={handleWishlist}
          aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <FiHeart className={cn('h-4 w-4', inWishlist && 'fill-primary text-primary')} />
        </Button>
      </div>
    </motion.article>
  );
}
