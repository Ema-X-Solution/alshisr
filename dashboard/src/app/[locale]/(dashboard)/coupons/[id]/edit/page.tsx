'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CouponForm } from '@/components/forms/CouponForm';
import { PageLoader } from '@/components/ui/loading';
import { couponsApi } from '@/lib/services';

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('coupons');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { id } = use(params);
  const { data: coupon, isLoading } = useQuery({ queryKey: ['coupon', id], queryFn: () => couponsApi.get(id) });
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/coupons' }, { label: tCommon('edit') }]} />
      <h2 className="text-2xl font-bold">{t('editTitle')}</h2>
      {coupon && <CouponForm coupon={coupon} onSubmit={(data) => couponsApi.update(id, data)} />}
    </div>
  );
}
