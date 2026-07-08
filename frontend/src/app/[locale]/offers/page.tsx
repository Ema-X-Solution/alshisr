'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { cmsApi } from '@/lib/api/cms';
import { productsApi } from '@/lib/api/products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SpecialOffers } from '@/components/home/SpecialOffers';
import { SectionHeading } from '@/components/shared/SectionHeading';

export default function OffersPage() {
  const t = useTranslations('offers');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['offers-products', page],
    queryFn: async () => {
      const result = await productsApi.getAll({ page, limit: 12, sortBy: 'price', sortOrder: 'asc' });
      return {
        ...result,
        data: result.data.filter((p) => (p.compareAtPrice ?? 0) > p.price),
      };
    },
  });

  return (
    <>
      <SpecialOffers />
      <div className="section-padding mx-auto max-w-7xl">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />
        <ProductGrid products={data?.data ?? []} isLoading={isLoading} />
      </div>
    </>
  );
}
