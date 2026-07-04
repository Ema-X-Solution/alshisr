'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { extractErrorMessage } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast({ title: t('loginSuccess') });
      router.push('/profile');
    } catch (error) {
      toast({ title: extractErrorMessage(error), variant: 'destructive' });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">{t('login')}</CardTitle>
        <CardDescription>{t('hasAccount')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{tVal('email')}</p>}
          </div>
          <div>
            <Label htmlFor="password">{t('password')}</Label>
            <Input id="password" type="password" {...register('password')} className="mt-1" />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{tVal('minLength', { min: 8 })}</p>
            )}
          </div>
          <div className="text-end">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {t('login')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-primary hover:underline">
              {t('register')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
