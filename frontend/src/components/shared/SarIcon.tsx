'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { APP_REGION } from '@alshisr/shared';
import { formatPriceAmount } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface OmrIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  locale?: Locale;
}

const textSizes = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function OmrIcon({ className, size = 'sm', locale: localeProp }: OmrIconProps) {
  const hookLocale = useLocale() as Locale;
  const locale = localeProp ?? hookLocale;
  const label = locale === 'ar' ? APP_REGION.currencyLabelAr : APP_REGION.currencyLabelEn;

  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 font-semibold leading-none', textSizes[size], className)}
    >
      {label}
    </span>
  );
}

// Backward-compatible alias
export { OmrIcon as SarIcon };
