import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageForm } from '@/components/forms/PageForm';
import { cmsApi } from '@/lib/services';

export default function CreatePagePage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Pages', href: '/pages' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Page</h2>
      <PageForm onSubmit={(data) => cmsApi.createPage(data)} />
    </div>
  );
}
