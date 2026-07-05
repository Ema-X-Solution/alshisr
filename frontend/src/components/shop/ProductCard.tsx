'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FiHeart } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Price, ComparePrice } from '@/components/shared/Price';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useAuth } from '@/lib/hooks/useAuth';
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
  const { field } = useLocaleField();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggle, isToggling } = useWishlist();
  const name = field(product, 'name');
  const image = getProductImage(product);
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product.id);

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
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <ComparePrice amount={product.compareAtPrice} />
            )}
          </div>
        </div>
      </Link>
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute end-1 top-1 h-8 w-8 bg-background/80 opacity-100 backdrop-blur sm:end-2 sm:top-2 sm:opacity-0 sm:group-hover:opacity-100"
          disabled={isToggling}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <FiHeart className={cn('h-4 w-4', inWishlist && 'fill-primary text-primary')} />
        </Button>
      )}
    </motion.article>
  );
}
