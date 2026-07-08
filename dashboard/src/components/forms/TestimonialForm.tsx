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
import type { Testimonial } from '@/lib/types';

const schema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional(),
  role: z.string().optional(),
  roleAr: z.string().optional(),
  content: z.string().min(1),
  contentAr: z.string().min(1),
  avatar: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).default(5),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function TestimonialForm({ testimonial, onSubmit }: TestimonialFormProps) {
  const router = useRouter();
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: testimonial?.name || '',
      nameAr: testimonial?.nameAr || '',
      role: testimonial?.role || '',
      roleAr: testimonial?.roleAr || '',
      content: testimonial?.content || '',
      contentAr: testimonial?.contentAr || '',
      avatar: testimonial?.avatar || '',
      rating: testimonial?.rating ?? 5,
      sortOrder: testimonial?.sortOrder ?? 0,
      isActive: testimonial?.isActive ?? true,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        nameAr: data.nameAr || undefined,
        role: data.role || undefined,
        roleAr: data.roleAr || undefined,
        avatar: data.avatar || undefined,
      });
      toast({
        title: testimonial
          ? tForms('updated', { item: tForms('itemTestimonial') })
          : tForms('created', { item: tForms('itemTestimonial') }),
      });
      await navigateAfterSave('/testimonials', 'testimonials');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemTestimonial') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title={tForms('itemTestimonial')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{tForms('nameEn')}</Label>
            <Input {...register('name')} />
          </div>
          <div className="space-y-2">
            <Label>{tForms('nameAr')}</Label>
            <Input dir="rtl" {...register('nameAr')} />
          </div>
          <div className="space-y-2">
            <Label>{tForms('roleEn')}</Label>
            <Input {...register('role')} placeholder={tForms('rolePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{tForms('roleAr')}</Label>
            <Input dir="rtl" {...register('roleAr')} />
          </div>
          <div className="space-y-2">
            <Label>{tForms('rating')}</Label>
            <Input type="number" min={1} max={5} {...register('rating')} />
          </div>
          <div className="space-y-2">
            <Label>{tForms('sortOrder')}</Label>
            <Input type="number" {...register('sortOrder')} />
          </div>
          <div className="flex items-center gap-2 pt-6 sm:col-span-2">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>{tCommon('active')}</Label>
          </div>
        </div>
        <div className="space-y-2">
          <Label>{tForms('contentEn')}</Label>
          <Textarea rows={4} {...register('content')} />
        </div>
        <div className="space-y-2">
          <Label>{tForms('contentAr')}</Label>
          <Textarea dir="rtl" rows={4} {...register('contentAr')} />
        </div>
        <ImageUpload
          value={watch('avatar')}
          onChange={(url) => setValue('avatar', url)}
          folder="testimonials"
          label={tForms('avatar')}
        />
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : testimonial ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
