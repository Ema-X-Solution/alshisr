'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogForm } from '@/components/forms/BlogForm';
import { PageLoader } from '@/components/ui/loading';
import { cmsApi } from '@/lib/services';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('blogs');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { id } = use(params);
  const { data, isLoading } = useQuery({ queryKey: ['blogs'], queryFn: () => cmsApi.listBlogs({ limit: 100 }) });
  const blog = data?.data?.find((b) => b.id === id);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/blogs' }, { label: tCommon('edit') }]} />
      <h2 className="text-2xl font-bold">{t('editTitle')}</h2>
      {blog && <BlogForm blog={blog} onSubmit={(data) => cmsApi.updateBlog(id, data)} />}
    </div>
  );
}
