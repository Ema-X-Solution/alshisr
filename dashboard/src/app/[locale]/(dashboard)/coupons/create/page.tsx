'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CouponForm } from '@/components/forms/CouponForm';
import { couponsApi } from '@/lib/services';

export default function CreateCouponPage() {
  const t = useTranslations('coupons');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/coupons' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <CouponForm onSubmit={(data) => couponsApi.create(data)} />
    </div>
  );
}
