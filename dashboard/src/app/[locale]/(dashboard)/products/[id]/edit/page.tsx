'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductForm } from '@/components/forms/ProductForm';
import { PageLoader } from '@/components/ui/loading';
import { productsApi } from '@/lib/services';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('products');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { id } = use(params);
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.get(id),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/products' }, { label: tCommon('edit') }]} />
      <h2 className="text-2xl font-bold">{t('editTitle')}</h2>
      {product && <ProductForm product={product} />}
    </div>
  );
}
