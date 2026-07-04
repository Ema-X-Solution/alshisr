'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FaqForm } from '@/components/forms/FaqForm';
import { PageLoader } from '@/components/ui/loading';
import { cmsApi } from '@/lib/services';

export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: faqs, isLoading } = useQuery({ queryKey: ['faqs'], queryFn: () => cmsApi.listFaqs() });
  const faq = faqs?.find((f) => f.id === id);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'FAQ', href: '/faq' }, { label: 'Edit' }]} />
      <h2 className="text-2xl font-bold">Edit FAQ</h2>
      {faq && <FaqForm faq={faq} onSubmit={(data) => cmsApi.updateFaq(id, data)} />}
    </div>
  );
}
