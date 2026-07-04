'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormSection, FormActions } from './FormSection';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Slider } from '@/lib/types';

const schema = z.object({
  title: z.string().min(1),
  titleAr: z.string().min(1),
  subtitle: z.string().optional(),
  subtitleAr: z.string().optional(),
  image: z.string().url(),
  mobileImage: z.string().optional(),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  buttonTextAr: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface SliderFormProps {
  slider?: Slider;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function SliderForm({ slider, onSubmit }: SliderFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: slider?.title || '',
      titleAr: slider?.titleAr || '',
      subtitle: slider?.subtitle || '',
      subtitleAr: slider?.subtitleAr || '',
      image: slider?.image || '',
      mobileImage: slider?.mobileImage || '',
      link: slider?.link || '',
      buttonText: slider?.buttonText || '',
      buttonTextAr: slider?.buttonTextAr || '',
      isActive: slider?.isActive ?? true,
      sortOrder: slider?.sortOrder || 0,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({ title: slider ? 'Slider updated' : 'Slider created' });
      router.push('/sliders');
    } catch {
      toast({ title: 'Failed to save slider', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Slider Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Title (EN)</Label><Input {...register('title')} /></div>
          <div className="space-y-2"><Label>Title (AR)</Label><Input dir="rtl" {...register('titleAr')} /></div>
          <div className="space-y-2"><Label>Subtitle (EN)</Label><Input {...register('subtitle')} /></div>
          <div className="space-y-2"><Label>Subtitle (AR)</Label><Input dir="rtl" {...register('subtitleAr')} /></div>
          <div className="space-y-2"><Label>Link URL</Label><Input {...register('link')} /></div>
          <div className="space-y-2"><Label>Button Text (EN)</Label><Input {...register('buttonText')} /></div>
          <div className="space-y-2"><Label>Sort Order</Label><Input type="number" {...register('sortOrder')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>Active</Label>
          </div>
        </div>
        <ImageUpload value={watch('image')} onChange={(url) => setValue('image', url)} folder="sliders" label="Desktop Image" />
        <ImageUpload value={watch('mobileImage')} onChange={(url) => setValue('mobileImage', url)} folder="sliders" label="Mobile Image" />
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : slider ? 'Update' : 'Create'}
        </Button>
      </FormActions>
    </form>
  );
}
