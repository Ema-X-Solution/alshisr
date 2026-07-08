'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BannerForm } from '@/components/forms/BannerForm';
import { cmsApi } from '@/lib/services';

export default function CreateBannerPage() {
  const t = useTranslations('banners');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/banners' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <BannerForm onSubmit={(data) => cmsApi.createBanner(data)} />
    </div>
  );
}
