'use client';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SliderForm } from '@/components/forms/SliderForm';
import { cmsApi } from '@/lib/services';

export default function CreateSliderPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Sliders', href: '/sliders' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Slider</h2>
      <SliderForm onSubmit={(data) => cmsApi.createSlider(data)} />
    </div>
  );
}
