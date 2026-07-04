'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogForm } from '@/components/forms/BlogForm';
import { PageLoader } from '@/components/ui/loading';
import { cmsApi } from '@/lib/services';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useQuery({ queryKey: ['blogs'], queryFn: () => cmsApi.listBlogs({ limit: 100 }) });
  const blog = data?.data?.find((b) => b.id === id);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Blogs', href: '/blogs' }, { label: 'Edit' }]} />
      <h2 className="text-2xl font-bold">Edit Blog Post</h2>
      {blog && <BlogForm blog={blog} onSubmit={(data) => cmsApi.updateBlog(id, data)} />}
    </div>
  );
}
