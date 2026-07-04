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
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Page } from '@/lib/types';

const schema = z.object({
  title: z.string().min(1),
  titleAr: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().min(1),
  contentAr: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface PageFormProps {
  page?: Page;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function PageForm({ page, onSubmit }: PageFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: page?.title || '',
      titleAr: page?.titleAr || '',
      slug: page?.slug || '',
      content: page?.content || '',
      contentAr: page?.contentAr || '',
      metaTitle: page?.metaTitle || '',
      metaDescription: page?.metaDescription || '',
      isPublished: page?.isPublished ?? false,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({ title: page ? 'Page updated' : 'Page created' });
      router.push('/pages');
    } catch {
      toast({ title: 'Failed to save page', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Page Content">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Title (EN)</Label><Input {...register('title')} /></div>
          <div className="space-y-2"><Label>Title (AR)</Label><Input dir="rtl" {...register('titleAr')} /></div>
          <div className="space-y-2"><Label>Slug</Label><Input {...register('slug')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isPublished')} onCheckedChange={(v) => setValue('isPublished', v)} />
            <Label>Published</Label>
          </div>
        </div>
        <div className="space-y-2"><Label>Content (EN)</Label><Textarea rows={10} {...register('content')} /></div>
        <div className="space-y-2"><Label>Content (AR)</Label><Textarea dir="rtl" rows={10} {...register('contentAr')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Meta Title</Label><Input {...register('metaTitle')} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Meta Description</Label><Textarea {...register('metaDescription')} /></div>
        </div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : page ? 'Update' : 'Create'}
        </Button>
      </FormActions>
    </form>
  );
}
