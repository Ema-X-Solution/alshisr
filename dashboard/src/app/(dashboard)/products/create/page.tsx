'use client';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductForm } from '@/components/forms/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Product</h2>
      <ProductForm />
    </div>
  );
}
