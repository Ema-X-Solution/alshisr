'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/cms';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFiltersSidebar, ProductFiltersSheet } from '@/components/shop/ProductFilters';
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
  const categoryList = (categories as Category[]) ?? [];

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">{t('title')}</h1>
        <ProductFiltersSheet
          filters={filters}
          onChange={setFilters}
          categories={categoryList}
          className="lg:hidden"
        />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <p className="text-sm text-muted-foreground">
          {meta ? t('productsFound', { count: meta.total }) : t('noProducts')}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <ProductFiltersSidebar
          filters={filters}
          onChange={setFilters}
          categories={categoryList}
        />
        <div className="min-w-0 flex-1">
          <p className="mb-4 hidden text-muted-foreground lg:block">
            {meta ? t('productsFound', { count: meta.total }) : t('noProducts')}
          </p>
          <ProductGrid products={products} isLoading={isLoading} />
          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2 sm:mt-10">
              <Button
                variant="outline"
                size="sm"
                className="sm:size-default"
                disabled={!meta.hasPrevPage}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground sm:px-4">
                {meta.page} / {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="sm:size-default"
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
