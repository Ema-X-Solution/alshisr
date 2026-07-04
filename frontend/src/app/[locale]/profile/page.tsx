'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { extractErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link } from '@/i18n/navigation';

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tAuth = useTranslations('auth');
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: user ? { firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: async () => {
      await refreshProfile();
      toast({ title: t('updateSuccess') });
    },
    onError: (error) => toast({ title: extractErrorMessage(error), variant: 'destructive' }),
  });

  if (!isAuthenticated) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <Button asChild><Link href="/login">{tAuth('login')}</Link></Button>
      </div>
    );
  }

  return (
    <div className="section-padding mx-auto max-w-2xl">
      <h1 className="font-display mb-8 text-4xl font-bold text-primary">{t('title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('personalInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">{tAuth('firstName')}</Label>
                <Input id="firstName" {...register('firstName')} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">{tAuth('lastName')}</Label>
                <Input id="lastName" {...register('lastName')} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{tAuth('email')}</Label>
              <Input value={user?.email ?? ''} disabled className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">{tAuth('phone')}</Label>
              <Input id="phone" {...register('phone')} className="mt-1" />
            </div>
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {t('title')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
