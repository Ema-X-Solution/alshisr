'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { FiHeart, FiStar } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Price, ComparePrice } from '@/components/shared/Price';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { getDiscountPercent, type Product, type ProductVariant } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations('product');
  const tCommon = useTranslations('common');
  const { field } = useLocaleField();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem, isAdding } = useCart();
  const { isInWishlist, toggle, isToggling } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null,
  );

  const name = field(product, 'name');
  const price = selectedVariant?.price ?? product.price;
  const compareAtPrice = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const stock = selectedVariant?.stock ?? product.stock;
  const discount = getDiscountPercent(price, compareAtPrice);
  const inWishlist = isInWishlist(product.id);

  const attributeKeys = product.hasVariants && product.variants?.length
    ? Object.keys(product.variants[0].attributes)
    : [];

  const requireAuth = () => {
    toast({ title: tCommon('loginRequired') });
    router.push('/login');
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    await addItem({
      productId: product.id,
      quantity,
      variantId: selectedVariant?.id,
    });
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    await toggle(product.id);
  };

  return (
    <div className="space-y-6">
      {product.category && (
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          {field(product.category, 'name')}
        </p>
      )}
      <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">{name}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-secondary">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar
              key={i}
              className={cn('h-4 w-4', i < Math.round(product.rating) && 'fill-current')}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Price amount={price} size="lg" />
        {discount > 0 && compareAtPrice != null && (
          <>
            <ComparePrice amount={compareAtPrice} className="text-lg" />
            <Badge variant="secondary">{t('discount', { percent: discount })}</Badge>
          </>
        )}
      </div>

      {field(product, 'shortDescription') && (
        <p className="text-muted-foreground leading-relaxed">{field(product, 'shortDescription')}</p>
      )}

      {attributeKeys.map((key) => (
        <div key={key}>
          <Label className="mb-2 block capitalize">{key}</Label>
          <div className="flex flex-wrap gap-2">
            {product.variants?.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.attributes[key]}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <Label className="mb-2 block">{t('quantity')}</Label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
          >
            +
          </Button>
        </div>
      </div>

      <p className={cn('text-sm font-medium', stock > 0 ? 'text-green-700' : 'text-destructive')}>
        {stock > 0 ? t('inStock') : t('outOfStock')}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={stock === 0 || isAdding}
          onClick={handleAddToCart}
        >
          {t('addToCart')}
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={isToggling}
          onClick={handleWishlist}
          aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <FiHeart className={cn('h-5 w-5', inWishlist && 'fill-primary text-primary')} />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {t('sku')}: {selectedVariant?.sku ?? product.sku}
      </p>
    </div>
  );
}
