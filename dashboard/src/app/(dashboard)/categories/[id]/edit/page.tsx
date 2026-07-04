'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { PageLoader } from '@/components/ui/loading';
import { categoriesApi } from '@/lib/services';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.get(id),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Categories', href: '/categories' }, { label: 'Edit' }]} />
      <h2 className="text-2xl font-bold">Edit Category</h2>
      {category && <CategoryForm category={category} onSubmit={(data) => categoriesApi.update(id, data)} />}
    </div>
  );
}
