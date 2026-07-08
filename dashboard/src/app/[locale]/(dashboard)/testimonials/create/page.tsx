'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TestimonialForm } from '@/components/forms/TestimonialForm';
import { cmsApi } from '@/lib/services';

export default function CreateTestimonialPage() {
  const t = useTranslations('testimonials');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: tNav('dashboard'), href: '/' },
          { label: t('title'), href: '/testimonials' },
          { label: tCommon('create') },
        ]}
      />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <TestimonialForm onSubmit={(data) => cmsApi.createTestimonial(data)} />
    </div>
  );
}
