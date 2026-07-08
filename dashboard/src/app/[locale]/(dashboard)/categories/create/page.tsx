'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { categoriesApi } from '@/lib/services';

export default function CreateCategoryPage() {
  const t = useTranslations('categories');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/categories' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <CategoryForm onSubmit={(data) => categoriesApi.create(data)} />
    </div>
  );
}
