import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogForm } from '@/components/forms/BlogForm';
import { cmsApi } from '@/lib/services';

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Blogs', href: '/blogs' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Blog Post</h2>
      <BlogForm onSubmit={(data) => cmsApi.createBlog(data)} />
    </div>
  );
}
