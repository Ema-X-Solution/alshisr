'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { authApi } from '@/lib/services';
import { BRAND } from '@alshisr/shared';
import { setAuth, isAdminRole } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import { useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('auth');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(1, t('passwordRequired')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await authApi.login(data.email, data.password);
      if (!isAdminRole(response.user.role)) {
        toast({ title: t('accessDenied'), description: t('adminRequired'), variant: 'destructive' });
        return;
      }
      setAuth(response.accessToken, response.refreshToken, response.user);
      toast({
        title: t('welcomeBack'),
        description: t('loggedInAs', { name: response.user.firstName }),
      });
      router.push(searchParams.get('redirect') || '/');
    } catch {
      toast({
        title: t('loginFailed'),
        description: t('invalidCredentials'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <BrandLogo className="mx-auto h-14 w-auto" height={56} priority />
          </div>
          <CardTitle className="text-2xl">
            {locale === 'ar' ? BRAND.nameAr || BRAND.name : BRAND.name}
          </CardTitle>
          <CardDescription>{t('signInTitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" placeholder="" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : t('signIn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
