'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { localizedField, formatPrice as formatPriceUtil, formatPriceAmount as formatPriceAmountUtil } from '@/lib/types';

export function useLocaleField() {
  const locale = useLocale() as Locale;

  return {
    locale,
    field: (item: object, name: string) => localizedField(item, name, locale),
    formatPrice: (amount: number) => formatPriceUtil(amount, locale),
    formatPriceAmount: (amount: number) => formatPriceAmountUtil(amount, locale),
    isRtl: locale === 'ar',
  };
}
