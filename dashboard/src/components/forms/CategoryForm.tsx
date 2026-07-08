'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useFormNavigation } from '@/hooks/use-form-navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection, FormActions } from './FormSection';
import { ImageUpload } from './ImageUpload';
import { categoriesApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Category } from '@/lib/types';

const schema = z.object({
  name: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const router = useRouter();
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name || '',
      nameAr: category?.nameAr || '',
      slug: category?.slug || '',
      description: category?.description || '',
      descriptionAr: category?.descriptionAr || '',
      image: category?.image || '',
      parentId: category?.parentId || '',
      isActive: category?.isActive ?? true,
      sortOrder: category?.sortOrder || 0,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({ ...data, parentId: data.parentId || undefined });
      toast({
        title: category
          ? tForms('updated', { item: tForms('itemCategory') })
          : tForms('created', { item: tForms('itemCategory') }),
      });
      await navigateAfterSave('/categories', 'categories');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemCategory') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Category Details">
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
            <Label>{tForms('slug')}</Label>
            <Input {...register('slug')} placeholder={tForms('slugPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{tForms('sortOrder')}</Label>
            <Input type="number" {...register('sortOrder')} />
          </div>
          <div className="space-y-2">
            <Label>{tForms('parent')}</Label>
            <Select value={watch('parentId') || 'none'} onValueChange={(v) => setValue('parentId', v === 'none' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder={tCommon('none')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{tCommon('none')}</SelectItem>
                {categories.filter((c) => c.id !== category?.id).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>{tCommon('active')}</Label>
          </div>
        </div>
        <ImageUpload value={watch('image')} onChange={(url) => setValue('image', url)} folder="categories" label="Category Image" />
        <div className="space-y-2">
          <Label>{tForms('descriptionEn')}</Label>
          <Textarea {...register('description')} />
        </div>
        <div className="space-y-2">
          <Label>{tForms('descriptionAr')}</Label>
          <Textarea dir="rtl" {...register('descriptionAr')} />
        </div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : category ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
