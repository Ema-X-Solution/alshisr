'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useFormNavigation } from '@/hooks/use-form-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormSection, FormActions } from './FormSection';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Brand } from '@/lib/types';

const schema = z.object({
  name: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function BrandForm({ brand, onSubmit }: BrandFormProps) {
  const router = useRouter();
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: brand?.name || '',
      nameAr: brand?.nameAr || '',
      slug: brand?.slug || '',
      description: brand?.description || '',
      descriptionAr: brand?.descriptionAr || '',
      logo: brand?.logo || '',
      isActive: brand?.isActive ?? true,
      sortOrder: brand?.sortOrder || 0,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({
        title: brand
          ? tForms('updated', { item: tForms('itemBrand') })
          : tForms('created', { item: tForms('itemBrand') }),
      });
      await navigateAfterSave('/brands', 'brands');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemBrand') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Brand Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>{tForms('nameEn')}</Label><Input {...register('name')} /></div>
          <div className="space-y-2"><Label>{tForms('nameAr')}</Label><Input dir="rtl" {...register('nameAr')} /></div>
          <div className="space-y-2"><Label>{tForms('slug')}</Label><Input {...register('slug')} /></div>
          <div className="space-y-2"><Label>{tForms('sortOrder')}</Label><Input type="number" {...register('sortOrder')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>{tCommon('active')}</Label>
          </div>
        </div>
        <ImageUpload value={watch('logo')} onChange={(url) => setValue('logo', url)} folder="brands" label="Logo" />
        <div className="space-y-2"><Label>{tForms('descriptionEn')}</Label><Textarea {...register('description')} /></div>
        <div className="space-y-2"><Label>{tForms('descriptionAr')}</Label><Textarea dir="rtl" {...register('descriptionAr')} /></div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : brand ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
