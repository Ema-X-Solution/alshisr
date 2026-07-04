'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductForm } from '@/components/forms/ProductForm';
import { PageLoader } from '@/components/ui/loading';
import { productsApi } from '@/lib/services';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.get(id),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Edit' }]} />
      <h2 className="text-2xl font-bold">Edit Product</h2>
      {product && <ProductForm product={product} />}
    </div>
  );
}
