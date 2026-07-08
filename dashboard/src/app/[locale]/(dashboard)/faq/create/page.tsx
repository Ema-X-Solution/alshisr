'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FaqForm } from '@/components/forms/FaqForm';
import { cmsApi } from '@/lib/services';

export default function CreateFaqPage() {
  const t = useTranslations('faq');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/faq' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <FaqForm onSubmit={(data) => cmsApi.createFaq(data)} />
    </div>
  );
}
