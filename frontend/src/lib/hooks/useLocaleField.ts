'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { localizedField, formatPrice as formatPriceUtil } from '@/lib/types';

export function useLocaleField() {
  const locale = useLocale() as Locale;

  return {
    locale,
    field: <T extends Record<string, unknown>>(item: T, name: string) =>
      localizedField(item, name, locale),
    formatPrice: (amount: number) => formatPriceUtil(amount, locale),
    isRtl: locale === 'ar',
  };
}
