'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PaymentMethods } from './PaymentMethods';
import { ordersApi } from '@/lib/api/orders';
import { couponsApi, shippingApi } from '@/lib/api/cms';
import { extractErrorMessage } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import type { PaymentMethod } from '@/lib/types';

const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof addressSchema>;

interface CheckoutFormProps {
  subtotal: number;
  onShippingChange: (cost: number) => void;
  onDiscountChange: (discount: number) => void;
}

export function CheckoutForm({ subtotal, onShippingChange, onDiscountChange }: CheckoutFormProps) {
  const t = useTranslations('checkout');
  const tVal = useTranslations('validation');
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [couponInput, setCouponInput] = useState('');

  const { data: zones } = useQuery({
    queryKey: ['shipping-zones'],
    queryFn: shippingApi.getZones,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'SA' },
  });

  const placeOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: (order) => {
      toast({ title: t('success') });
      router.push(`/orders/${order.id}`);
    },
    onError: (error) => {
      toast({ title: extractErrorMessage(error), variant: 'destructive' });
    },
  });

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const result = await couponsApi.validate(couponInput, subtotal);
      if (result.valid && result.coupon) {
        onDiscountChange(result.coupon.discount);
        toast({ title: 'Coupon applied' });
      } else {
        toast({ title: result.message || 'Invalid coupon', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: extractErrorMessage(error), variant: 'destructive' });
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    const zone = zones?.[0];
    const rate = zone?.rates?.[0];
    let shippingCost = rate?.price ?? 0;

    if (zone && rate) {
      try {
        const calc = await shippingApi.calculate({
          zoneId: zone.id,
          rateId: rate.id,
          subtotal,
        });
        shippingCost = calc.cost ?? rate.price;
      } catch {
        shippingCost = rate.price;
      }
    }

    onShippingChange(shippingCost);

    await placeOrderMutation.mutateAsync({
      paymentMethod,
      shippingAddress: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      },
      couponCode: data.couponCode,
      notes: data.notes,
      shippingRateId: rate?.id,
      shippingCost,
    });
  };

  const fields = [
    { name: 'firstName' as const, label: t('firstName') },
    { name: 'lastName' as const, label: t('lastName') },
    { name: 'phone' as const, label: t('phone') },
    { name: 'addressLine1' as const, label: t('addressLine1') },
    { name: 'addressLine2' as const, label: t('addressLine2') },
    { name: 'city' as const, label: t('city') },
    { name: 'state' as const, label: t('state') },
    { name: 'country' as const, label: t('country') },
    { name: 'postalCode' as const, label: t('postalCode') },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h3 className="font-display mb-6 text-lg font-semibold">{t('shippingAddress')}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ name, label }) => (
            <div key={name} className={name === 'addressLine1' ? 'sm:col-span-2' : ''}>
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} {...register(name)} className="mt-1" />
              {errors[name] && (
                <p className="mt-1 text-xs text-destructive">{tVal('required')}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <PaymentMethods value={paymentMethod} onChange={setPaymentMethod} />

      <div>
        <Label>{t('couponCode')}</Label>
        <div className="mt-1 flex gap-2">
          <Input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder={t('couponCode')}
          />
          <Button type="button" variant="outline" onClick={applyCoupon}>
            {t('applyCoupon')}
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder={t('notesPlaceholder')}
          className="mt-1"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || placeOrderMutation.isPending}>
        {t('placeOrder')}
      </Button>
    </form>
  );
}
