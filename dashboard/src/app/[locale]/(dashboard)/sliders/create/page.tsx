'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SliderForm } from '@/components/forms/SliderForm';
import { cmsApi } from '@/lib/services';

export default function CreateSliderPage() {
  const t = useTranslations('sliders');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/sliders' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <SliderForm onSubmit={(data) => cmsApi.createSlider(data)} />
    </div>
  );
}
