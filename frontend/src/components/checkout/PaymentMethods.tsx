'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PaymentMethod } from '@/lib/types';

interface PaymentMethodsProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
  const t = useTranslations('checkout');

  const methods: PaymentMethod[] = ['COD', 'STRIPE', 'MYFATOORAH'];

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold">{t('paymentMethod')}</h3>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as PaymentMethod)}>
        {methods.map((method) => (
          <div key={method} className="flex items-center space-x-3 space-x-reverse rounded-sm border p-4">
            <RadioGroupItem value={method} id={method} />
            <Label htmlFor={method} className="flex-1 cursor-pointer font-normal">
              {t(`paymentMethods.${method}`)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
