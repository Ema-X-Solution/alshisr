'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { categoriesApi } from '@/lib/api/cms';
import { productsApi } from '@/lib/api/products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations('shop');
  const { field } = useLocaleField();
  const [page, setPage] = useState(1);

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesApi.getBySlug(slug),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'category', slug, page],
    queryFn: () => productsApi.getAll({ category: slug, page, limit: 12 }),
    enabled: !!slug,
  });

  if (categoryLoading) {
    return (
      <div className="section-padding mx-auto max-w-7xl">
        <Skeleton className="mb-8 h-10 w-64" />
        <ProductGrid products={[]} isLoading />
      </div>
    );
  }

  const cat = category as Category;

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <h1 className="font-display mb-4 text-4xl font-bold text-primary">{field(cat, 'name')}</h1>
      {field(cat, 'description') && (
        <p className="mb-8 max-w-2xl text-muted-foreground">{field(cat, 'description')}</p>
      )}
      <ProductGrid products={data?.data ?? []} isLoading={isLoading} />
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          <Button variant="outline" disabled={!data.meta.hasPrevPage} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">{data.meta.page} / {data.meta.totalPages}</span>
          <Button variant="outline" disabled={!data.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
