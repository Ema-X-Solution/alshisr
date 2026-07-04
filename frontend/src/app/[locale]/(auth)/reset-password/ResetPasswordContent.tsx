'use client';

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { authApi } from '@/lib/api/auth';
import { extractErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'] });

export default function ResetPasswordContent() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get('token') ?? '';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { password: string }) => {
    try {
      await authApi.resetPassword(token, data.password);
      toast({ title: t('resetSuccess') });
      router.push('/login');
    } catch (error) {
      toast({ title: extractErrorMessage(error), variant: 'destructive' });
    }
  };

  if (!token) {
    return (
      <div className="section-padding text-center text-destructive">Invalid reset link</div>
    );
  }

  return (
    <div className="section-padding flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">{t('resetPassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password">{t('newPassword')}</Label>
              <Input id="password" type="password" {...register('password')} className="mt-1" />
              {errors.password && <p className="mt-1 text-xs text-destructive">{tVal('minLength', { min: 8 })}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} className="mt-1" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{tVal('passwordMatch')}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{t('resetPassword')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
