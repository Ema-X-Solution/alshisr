'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageForm } from '@/components/forms/PageForm';
import { cmsApi } from '@/lib/services';

export default function CreatePagePage() {
  const t = useTranslations('pages');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/pages' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <PageForm onSubmit={(data) => cmsApi.createPage(data)} />
    </div>
  );
}
