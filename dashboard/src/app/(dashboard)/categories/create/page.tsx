'use client';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { categoriesApi } from '@/lib/services';

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Categories', href: '/categories' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Category</h2>
      <CategoryForm onSubmit={(data) => categoriesApi.create(data)} />
    </div>
  );
}
