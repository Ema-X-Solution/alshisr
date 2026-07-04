import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BrandForm } from '@/components/forms/BrandForm';
import { brandsApi } from '@/lib/services';

export default function CreateBrandPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Brands', href: '/brands' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Brand</h2>
      <BrandForm onSubmit={(data) => brandsApi.create(data)} />
    </div>
  );
}
