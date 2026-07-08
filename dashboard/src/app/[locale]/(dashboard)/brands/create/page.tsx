'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BrandForm } from '@/components/forms/BrandForm';
import { brandsApi } from '@/lib/services';

export default function CreateBrandPage() {
  const t = useTranslations('brands');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/brands' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <BrandForm onSubmit={(data) => brandsApi.create(data)} />
    </div>
  );
}
