'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { productsApi } from '@/lib/api/products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/button';

interface ProductSectionProps {
  titleKey: 'bestSellers' | 'featured';
  filter: { bestSeller?: boolean; featured?: boolean };
}

export function ProductSection({ titleKey, filter }: ProductSectionProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  const { data, isLoading } = useQuery({
    queryKey: ['products', titleKey],
    queryFn: () => productsApi.getAll({ ...filter, limit: 8 }),
  });

  const products = data?.data ?? [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="section-padding mx-auto max-w-7xl">
      <SectionHeading title={t(titleKey)} />
      <ProductGrid products={products} isLoading={isLoading} />
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/shop">{tCommon('viewAll')}</Link>
        </Button>
      </div>
    </section>
  );
}

export function BestSellers() {
  return <ProductSection titleKey="bestSellers" filter={{ bestSeller: true }} />;
}

export function FeaturedProducts() {
  return <ProductSection titleKey="featured" filter={{ featured: true }} />;
}
