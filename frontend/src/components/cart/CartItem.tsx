'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { getProductImage, type CartItem as CartItemType } from '@/lib/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const t = useTranslations('cart');
  const { field, formatPrice } = useLocaleField();
  const product = item.product;
  const price = item.variant?.price ?? product.price;
  const name = field(product, 'name');
  const image = getProductImage(product);

  return (
    <div className="flex gap-4 border-b py-6">
      <Link href={`/shop/${product.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden bg-muted">
        <Image src={image} alt={name} fill className="object-cover" sizes="80px" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/shop/${product.slug}`} className="font-display font-medium hover:text-primary">
            {name}
          </Link>
          {item.variant && (
            <p className="text-sm text-muted-foreground">
              {Object.values(item.variant.attributes).join(' / ')}
            </p>
          )}
          <p className="mt-1 font-semibold text-primary">{formatPrice(price)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              -
            </Button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
            {t('remove')}
          </Button>
        </div>
      </div>
    </div>
  );
}
