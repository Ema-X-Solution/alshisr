'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BrandForm } from '@/components/forms/BrandForm';
import { PageLoader } from '@/components/ui/loading';
import { brandsApi } from '@/lib/services';

export default function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: brand, isLoading } = useQuery({ queryKey: ['brand', id], queryFn: () => brandsApi.get(id) });
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Brands', href: '/brands' }, { label: 'Edit' }]} />
      <h2 className="text-2xl font-bold">Edit Brand</h2>
      {brand && <BrandForm brand={brand} onSubmit={(data) => brandsApi.update(id, data)} />}
    </div>
  );
}
