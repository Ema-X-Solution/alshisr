'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FaqForm } from '@/components/forms/FaqForm';
import { PageLoader } from '@/components/ui/loading';
import { cmsApi } from '@/lib/services';

export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('faq');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { id } = use(params);
  const { data: faqs, isLoading } = useQuery({ queryKey: ['faqs'], queryFn: () => cmsApi.listFaqs() });
  const faq = faqs?.find((f) => f.id === id);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/faq' }, { label: tCommon('edit') }]} />
      <h2 className="text-2xl font-bold">{t('editTitle')}</h2>
      {faq && <FaqForm faq={faq} onSubmit={(data) => cmsApi.updateFaq(id, data)} />}
    </div>
  );
}
