'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productsApi } from '@/lib/api/products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SectionHeading } from '@/components/shared/SectionHeading';

export default function SearchPageContent() {
  const t = useTranslations('search');
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => productsApi.search(query),
    enabled: query.length > 0,
  });

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <SectionHeading
        title={query ? t('resultsFor', { query }) : t('title')}
        subtitle={!query ? t('placeholder') : undefined}
      />
      {query ? (
        data?.data?.length ? (
          <ProductGrid products={data.data} isLoading={isLoading} />
        ) : (
          !isLoading && <p className="text-center text-muted-foreground">{t('noResults')}</p>
        )
      ) : null}
    </div>
  );
}
