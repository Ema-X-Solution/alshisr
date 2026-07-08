'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogForm } from '@/components/forms/BlogForm';
import { cmsApi } from '@/lib/services';

export default function CreateBlogPage() {
  const t = useTranslations('blogs');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/blogs' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <BlogForm onSubmit={(data) => cmsApi.createBlog(data)} />
    </div>
  );
}
