'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { authApi } from '@/lib/api/auth';
import { extractErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link } from '@/i18n/navigation';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await authApi.forgotPassword(data.email);
      toast({ title: t('forgotSuccess') });
    } catch (error) {
      toast({ title: extractErrorMessage(error), variant: 'destructive' });
    }
  };

  return (
    <div className="section-padding flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">{t('forgotPassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" {...register('email')} className="mt-1" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{tVal('email')}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{t('sendResetLink')}</Button>
            <p className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">{t('login')}</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
