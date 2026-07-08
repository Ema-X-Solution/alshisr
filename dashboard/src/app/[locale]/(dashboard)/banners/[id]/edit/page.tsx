'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BannerForm } from '@/components/forms/BannerForm';
import { PageLoader } from '@/components/ui/loading';
import { cmsApi } from '@/lib/services';

export default function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('banners');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { id } = use(params);
  const { data: banners, isLoading } = useQuery({ queryKey: ['banners'], queryFn: () => cmsApi.listBanners() });
  const banner = banners?.find((b) => b.id === id);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/banners' }, { label: tCommon('edit') }]} />
      <h2 className="text-2xl font-bold">{t('editTitle')}</h2>
      {banner && <BannerForm banner={banner} onSubmit={(data) => cmsApi.updateBanner(id, data)} />}
    </div>
  );
}
