'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productsApi } from '@/lib/api/products';
import { ProductGrid } from './ProductGrid';
import { SectionHeading } from '@/components/shared/SectionHeading';

interface RelatedProductsProps {
  slug: string;
}

export function RelatedProducts({ slug }: RelatedProductsProps) {
  const t = useTranslations('product');
  const { data: products, isLoading } = useQuery({
    queryKey: ['related', slug],
    queryFn: () => productsApi.getRelated(slug),
  });

  if (!isLoading && !products?.length) return null;

  return (
    <section className="mt-16">
      <SectionHeading title={t('relatedProducts')} align="start" />
      <ProductGrid products={products ?? []} isLoading={isLoading} />
    </section>
  );
}
