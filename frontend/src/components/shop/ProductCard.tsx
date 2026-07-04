'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FiHeart } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const { field, formatPrice } = useLocaleField();
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
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute start-3 top-3 bg-secondary text-secondary-foreground">
              {t('discount', { percent: discount })}
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="absolute end-3 top-3" variant="default">
              Best Seller
            </Badge>
          )}
        </div>
        <div className="mt-4 space-y-1">
          {product.category && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {field(product.category, 'name')}
            </p>
          )}
          <h3 className="font-display text-lg font-medium leading-tight group-hover:text-primary">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute end-2 top-2 bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
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
