'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
  const { toast } = useToast();

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
      toast({ title: brand ? 'Brand updated' : 'Brand created' });
      router.push('/brands');
    } catch {
      toast({ title: 'Failed to save brand', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Brand Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Name (EN)</Label><Input {...register('name')} /></div>
          <div className="space-y-2"><Label>Name (AR)</Label><Input dir="rtl" {...register('nameAr')} /></div>
          <div className="space-y-2"><Label>Slug</Label><Input {...register('slug')} /></div>
          <div className="space-y-2"><Label>Sort Order</Label><Input type="number" {...register('sortOrder')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>Active</Label>
          </div>
        </div>
        <ImageUpload value={watch('logo')} onChange={(url) => setValue('logo', url)} folder="brands" label="Logo" />
        <div className="space-y-2"><Label>Description (EN)</Label><Textarea {...register('description')} /></div>
        <div className="space-y-2"><Label>Description (AR)</Label><Textarea dir="rtl" {...register('descriptionAr')} /></div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : brand ? 'Update' : 'Create'}
        </Button>
      </FormActions>
    </form>
  );
}
