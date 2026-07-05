'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FiFilter } from 'react-icons/fi';
import type { Category, ProductFilters } from '@/lib/types';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { cn } from '@/lib/utils/cn';

interface ProductFiltersProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  categories?: Category[];
}

function FilterContent({ filters, onChange, categories = [] }: ProductFiltersProps) {
  const t = useTranslations('shop');
  const { field } = useLocaleField();

  const update = (partial: Partial<ProductFilters>) => {
    onChange({ ...filters, ...partial, page: 1 });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">{t('sortBy')}</Label>
        <Select
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc'];
            update({ sortBy, sortOrder });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">{t('sortOptions.newest')}</SelectItem>
            <SelectItem value="price-asc">{t('sortOptions.priceAsc')}</SelectItem>
            <SelectItem value="price-desc">{t('sortOptions.priceDesc')}</SelectItem>
            <SelectItem value="soldCount-desc">{t('sortOptions.popular')}</SelectItem>
            <SelectItem value="rating-desc">{t('sortOptions.rating')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {categories.length > 0 && (
        <div>
          <Label className="mb-2 block">{t('category')}</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => update({ category: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {field(cat, 'name')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="mb-2 block">{t('priceRange')}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              update({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          onChange({ page: 1, limit: filters.limit, sortBy: 'createdAt', sortOrder: 'desc' })
        }
      >
        {t('clearFilters')}
      </Button>
    </div>
  );
}

export function ProductFiltersSidebar({ filters, onChange, categories }: ProductFiltersProps) {
  const t = useTranslations('shop');

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <h3 className="font-display mb-6 text-lg font-semibold">{t('filters')}</h3>
      <FilterContent filters={filters} onChange={onChange} categories={categories} />
    </aside>
  );
}

export function ProductFiltersSheet({
  filters,
  onChange,
  categories,
  className,
}: ProductFiltersProps & { className?: string }) {
  const t = useTranslations('shop');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn('shrink-0', className)}>
          <FiFilter className="me-2 h-4 w-4" />
          {t('filters')}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(100vw-2rem,20rem)]">
        <SheetHeader>
          <SheetTitle>{t('filters')}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterContent filters={filters} onChange={onChange} categories={categories} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** @deprecated Use ProductFiltersSidebar + ProductFiltersSheet */
export function ProductFiltersPanel(props: ProductFiltersProps) {
  return (
    <>
      <ProductFiltersSidebar {...props} />
      <ProductFiltersSheet {...props} className="lg:hidden" />
    </>
  );
}
