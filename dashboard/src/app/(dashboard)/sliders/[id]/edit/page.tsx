'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SliderForm } from '@/components/forms/SliderForm';
import { PageLoader } from '@/components/ui/loading';
import { cmsApi } from '@/lib/services';

export default function EditSliderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: sliders, isLoading } = useQuery({ queryKey: ['sliders'], queryFn: cmsApi.listSliders });
  const slider = sliders?.find((s) => s.id === id);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Sliders', href: '/sliders' }, { label: 'Edit' }]} />
      <h2 className="text-2xl font-bold">Edit Slider</h2>
      {slider && <SliderForm slider={slider} onSubmit={(data) => cmsApi.updateSlider(id, data)} />}
    </div>
  );
}
