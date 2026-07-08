'use client';

import { HiOutlineChevronRight, HiOutlineChevronLeft } from 'react-icons/hi';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const locale = useLocale();
  const Chevron = locale === 'ar' ? HiOutlineChevronLeft : HiOutlineChevronRight;

  return (
    <nav className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <Chevron className="h-4 w-4" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
