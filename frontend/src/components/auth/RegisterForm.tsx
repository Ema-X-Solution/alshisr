'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { extractErrorMessage } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';

const registerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordMatch',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      toast({ title: t('registerSuccess') });
      router.push('/profile');
    } catch (error) {
      toast({ title: extractErrorMessage(error), variant: 'destructive' });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">{t('register')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">{t('firstName')}</Label>
              <Input id="firstName" {...register('firstName')} className="mt-1" />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{tVal('required')}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">{t('lastName')}</Label>
              <Input id="lastName" {...register('lastName')} className="mt-1" />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{tVal('required')}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{tVal('email')}</p>}
          </div>
          <div>
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input id="phone" {...register('phone')} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">{t('password')}</Label>
            <Input id="password" type="password" {...register('password')} className="mt-1" />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{tVal('minLength', { min: 8 })}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} className="mt-1" />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{tVal('passwordMatch')}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {t('register')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t('hasAccount')}{' '}
            <Link href="/login" className="text-primary hover:underline">
              {t('login')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
