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
import type { Banner } from '@/lib/types';

const schema = z.object({
  title: z.string().min(1),
  titleAr: z.string().min(1),
  subtitle: z.string().optional(),
  subtitleAr: z.string().optional(),
  image: z.string().url(),
  link: z.string().optional(),
  position: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface BannerFormProps {
  banner?: Banner;
  onSubmit: (data: FormData) => Promise<void>;
}

export function BannerForm({ banner, onSubmit }: BannerFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: banner?.title || '',
      titleAr: banner?.titleAr || '',
      subtitle: banner?.subtitle || '',
      subtitleAr: banner?.subtitleAr || '',
      image: banner?.image || '',
      link: banner?.link || '',
      position: banner?.position || 'home',
      isActive: banner?.isActive ?? true,
      sortOrder: banner?.sortOrder || 0,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({ title: banner ? 'Banner updated' : 'Banner created' });
      router.push('/banners');
    } catch {
      toast({ title: 'Failed to save banner', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Banner Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Title (EN)</Label><Input {...register('title')} /></div>
          <div className="space-y-2"><Label>Title (AR)</Label><Input dir="rtl" {...register('titleAr')} /></div>
          <div className="space-y-2"><Label>Subtitle (EN)</Label><Input {...register('subtitle')} /></div>
          <div className="space-y-2"><Label>Subtitle (AR)</Label><Input dir="rtl" {...register('subtitleAr')} /></div>
          <div className="space-y-2"><Label>Link URL</Label><Input {...register('link')} /></div>
          <div className="space-y-2"><Label>Position</Label><Input {...register('position')} placeholder="home, category, etc." /></div>
          <div className="space-y-2"><Label>Sort Order</Label><Input type="number" {...register('sortOrder')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>Active</Label>
          </div>
        </div>
        <ImageUpload value={watch('image')} onChange={(url) => setValue('image', url)} folder="banners" label="Banner Image" />
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : banner ? 'Update' : 'Create'}
        </Button>
      </FormActions>
    </form>
  );
}
