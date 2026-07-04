import Link from 'next/link';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <HiOutlineChevronRight className="h-4 w-4" />}
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
