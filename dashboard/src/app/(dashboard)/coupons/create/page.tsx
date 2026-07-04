import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CouponForm } from '@/components/forms/CouponForm';
import { couponsApi } from '@/lib/services';

export default function CreateCouponPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Coupons', href: '/coupons' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create Coupon</h2>
      <CouponForm onSubmit={(data) => couponsApi.create(data)} />
    </div>
  );
}
