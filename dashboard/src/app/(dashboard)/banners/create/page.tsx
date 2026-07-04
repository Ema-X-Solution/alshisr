'use client';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BannerForm } from '@/components/forms/BannerForm';
import { cmsApi } from '@/lib/services';

export default function CreateBannerPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Banners', href: '/banners' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Banner</h2>
      <BannerForm onSubmit={(data) => cmsApi.createBanner(data)} />
    </div>
  );
}
