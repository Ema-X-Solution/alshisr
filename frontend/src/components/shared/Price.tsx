'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { formatPriceAmount } from '@/lib/types';
import { SarIcon } from '@/components/shared/SarIcon';
import { cn } from '@/lib/utils/cn';

interface PriceProps {
  amount: number;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  locale?: Locale;
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

const iconSizes = {
  sm: 'xs' as const,
  md: 'sm' as const,
  lg: 'md' as const,
};

export function Price({
  amount,
  className,
  iconClassName,
  size = 'md',
  locale: localeProp,
}: PriceProps) {
  const hookLocale = useLocale() as Locale;
  const locale = localeProp ?? hookLocale;

  return (
    <span className={cn('inline-flex items-center gap-1 font-semibold text-primary', textSizes[size], className)}>
      <SarIcon size={iconSizes[size]} className={cn('text-primary', iconClassName)} />
      <span>{formatPriceAmount(amount, locale)}</span>
    </span>
  );
}

interface ComparePriceProps {
  amount: number;
  className?: string;
  locale?: Locale;
}

export function ComparePrice({ amount, className, locale: localeProp }: ComparePriceProps) {
  const hookLocale = useLocale() as Locale;
  const locale = localeProp ?? hookLocale;

  return (
    <span className={cn('inline-flex items-center gap-0.5 text-sm text-muted-foreground line-through', className)}>
      <SarIcon size="xs" className="text-muted-foreground" />
      <span>{formatPriceAmount(amount, locale)}</span>
    </span>
  );
}
