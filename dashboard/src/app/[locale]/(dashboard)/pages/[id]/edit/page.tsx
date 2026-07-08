'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageForm } from '@/components/forms/PageForm';
import { PageLoader } from '@/components/ui/loading';
import { cmsApi } from '@/lib/services';

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('pages');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { id } = use(params);
  const { data: pages, isLoading } = useQuery({ queryKey: ['pages'], queryFn: cmsApi.listPages });
  const page = pages?.find((p) => p.id === id);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/pages' }, { label: tCommon('edit') }]} />
      <h2 className="text-2xl font-bold">{t('editTitle')}</h2>
      {page && <PageForm page={page} onSubmit={(data) => cmsApi.updatePage(id, data)} />}
    </div>
  );
}
