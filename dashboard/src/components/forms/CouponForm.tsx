'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection, FormActions } from './FormSection';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Coupon } from '@/lib/types';

const schema = z.object({
  code: z.string().min(1),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().min(0),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(1).optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function CouponForm({ coupon, onSubmit }: CouponFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: coupon?.code || '',
      description: coupon?.description || '',
      descriptionAr: coupon?.descriptionAr || '',
      type: coupon?.type || 'percentage',
      value: coupon?.value || 0,
      minOrderAmount: coupon?.minOrderAmount,
      maxDiscount: coupon?.maxDiscount,
      usageLimit: coupon?.usageLimit,
      isActive: coupon?.isActive ?? true,
      startsAt: coupon?.startsAt?.split('T')[0] || '',
      expiresAt: coupon?.expiresAt?.split('T')[0] || '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({
        title: coupon
          ? tForms('updated', { item: tForms('itemCoupon') })
          : tForms('created', { item: tForms('itemCoupon') }),
      });
      router.push('/coupons');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemCoupon') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Coupon Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>{tForms('code')}</Label><Input {...register('code')} className="uppercase" /></div>
          <div className="space-y-2">
            <Label>{tForms('discountType')}</Label>
            <Select value={watch('type')} onValueChange={(v) => setValue('type', v as 'percentage' | 'fixed')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>{tForms('discountValue')}</Label><Input type="number" step="0.01" {...register('value')} /></div>
          <div className="space-y-2"><Label>{tForms('minOrder')}</Label><Input type="number" step="0.01" {...register('minOrderAmount')} /></div>
          <div className="space-y-2"><Label>Max Discount</Label><Input type="number" step="0.01" {...register('maxDiscount')} /></div>
          <div className="space-y-2"><Label>{tForms('maxUses')}</Label><Input type="number" {...register('usageLimit')} /></div>
          <div className="space-y-2"><Label>{tForms('startsAt')}</Label><Input type="date" {...register('startsAt')} /></div>
          <div className="space-y-2"><Label>{tForms('expiresAt')}</Label><Input type="date" {...register('expiresAt')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>{tCommon('active')}</Label>
          </div>
        </div>
        <div className="space-y-2"><Label>{tForms('descriptionEn')}</Label><Textarea {...register('description')} /></div>
        <div className="space-y-2"><Label>{tForms('descriptionAr')}</Label><Textarea dir="rtl" {...register('descriptionAr')} /></div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : coupon ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
