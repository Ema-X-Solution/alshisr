import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FaqForm } from '@/components/forms/FaqForm';
import { cmsApi } from '@/lib/services';

export default function CreateFaqPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'FAQ', href: '/faq' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create FAQ</h2>
      <FaqForm onSubmit={(data) => cmsApi.createFaq(data)} />
    </div>
  );
}
