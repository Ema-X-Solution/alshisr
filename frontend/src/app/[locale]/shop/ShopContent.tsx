'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/cms';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFiltersPanel } from '@/components/shop/ProductFilters';
import { Button } from '@/components/ui/button';
import type { Category, ProductFilters } from '@/lib/types';

export default function ShopPageContent() {
  const t = useTranslations('shop');
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    category: searchParams.get('category') || undefined,
    search: searchParams.get('q') || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <h1 className="font-display mb-8 text-4xl font-bold text-primary">{t('title')}</h1>
      <div className="flex gap-8">
        <ProductFiltersPanel
          filters={filters}
          onChange={setFilters}
          categories={(categories as Category[]) ?? []}
        />
        <div className="flex-1">
          <p className="mb-6 text-muted-foreground">
            {meta ? t('productsFound', { count: meta.total }) : t('noProducts')}
          </p>
          <ProductGrid products={products} isLoading={isLoading} />
          {meta && meta.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={!meta.hasPrevPage}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                {meta.page} / {meta.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!meta.hasNextPage}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
