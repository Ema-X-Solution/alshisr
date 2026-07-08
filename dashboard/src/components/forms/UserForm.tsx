'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useFormNavigation } from '@/hooks/use-form-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormSection, FormActions } from './FormSection';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { User } from '@/lib/types';

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CUSTOMER']),
  password: z.string().min(8).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function UserForm({ user, onSubmit }: UserFormProps) {
  const router = useRouter();
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');
  const tStatus = useTranslations('status');
  const isEdit = !!user;

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      role: user?.role || 'CUSTOMER',
      password: '',
      isActive: user?.isActive ?? true,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      const payload = { ...data, password: data.password || undefined };
      await onSubmit(payload);
      toast({
        title: isEdit
          ? tForms('updated', { item: tForms('itemUser') })
          : tForms('created', { item: tForms('itemUser') }),
      });
      await navigateAfterSave('/users', 'users');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemUser') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="User Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>{tForms('email')}</Label><Input type="email" {...register('email')} disabled={isEdit} /></div>
          <div className="space-y-2">
            <Label>{tForms('role')}</Label>
            <Select value={watch('role')} onValueChange={(v) => setValue('role', v as FormData['role'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">{tStatus('SUPER_ADMIN')}</SelectItem>
                <SelectItem value="ADMIN">{tStatus('ADMIN')}</SelectItem>
                <SelectItem value="MANAGER">{tStatus('MANAGER')}</SelectItem>
                <SelectItem value="CUSTOMER">{tStatus('CUSTOMER')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>{tForms('firstName')}</Label><Input {...register('firstName')} /></div>
          <div className="space-y-2"><Label>{tForms('lastName')}</Label><Input {...register('lastName')} /></div>
          <div className="space-y-2"><Label>{tForms('phone')}</Label><Input {...register('phone')} /></div>
          {!isEdit && (
            <div className="space-y-2">
              <Label>{tForms('password')}</Label>
              <Input type="password" {...register('password')} placeholder="Min 8 characters" />
            </div>
          )}
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>{tCommon('active')}</Label>
          </div>
        </div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : isEdit ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
