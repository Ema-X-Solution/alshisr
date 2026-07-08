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
import type { Blog } from '@/lib/types';

const schema = z.object({
  title: z.string().min(1),
  titleAr: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  excerptAr: z.string().optional(),
  content: z.string().min(1),
  contentAr: z.string().min(1),
  image: z.string().optional(),
  author: z.string().optional(),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BlogFormProps {
  blog?: Blog;
  onSubmit: (data: Omit<FormData, 'tags'> & { tags?: string[] }) => Promise<unknown>;
}

export function BlogForm({ blog, onSubmit }: BlogFormProps) {
  const router = useRouter();
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: blog?.title || '',
      titleAr: blog?.titleAr || '',
      slug: blog?.slug || '',
      excerpt: blog?.excerpt || '',
      excerptAr: blog?.excerptAr || '',
      content: blog?.content || '',
      contentAr: blog?.contentAr || '',
      image: blog?.image || '',
      author: blog?.author || '',
      isPublished: blog?.isPublished ?? false,
      metaTitle: blog?.metaTitle || '',
      metaDescription: blog?.metaDescription || '',
      tags: blog?.tags?.join(', ') || '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      });
      toast({
        title: blog
          ? tForms('updated', { item: tForms('itemBlog') })
          : tForms('created', { item: tForms('itemBlog') }),
      });
      await navigateAfterSave('/blogs', 'blogs');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemBlog') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="Blog Post">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>{tForms('titleEn')}</Label><Input {...register('title')} /></div>
          <div className="space-y-2"><Label>{tForms('titleAr')}</Label><Input dir="rtl" {...register('titleAr')} /></div>
          <div className="space-y-2"><Label>{tForms('slug')}</Label><Input {...register('slug')} /></div>
          <div className="space-y-2"><Label>Author</Label><Input {...register('author')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isPublished')} onCheckedChange={(v) => setValue('isPublished', v)} />
            <Label>{tCommon('published')}</Label>
          </div>
        </div>
        <ImageUpload value={watch('image')} onChange={(url) => setValue('image', url)} folder="blogs" label="Featured Image" />
        <div className="space-y-2"><Label>Excerpt (EN)</Label><Textarea {...register('excerpt')} /></div>
        <div className="space-y-2"><Label>{tForms('contentEn')}</Label><Textarea rows={8} {...register('content')} /></div>
        <div className="space-y-2"><Label>{tForms('contentAr')}</Label><Textarea dir="rtl" rows={8} {...register('contentAr')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Meta Title</Label><Input {...register('metaTitle')} /></div>
          <div className="space-y-2"><Label>{tForms('tags')}</Label><Input {...register('tags')} placeholder="luxury, fashion" /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Meta Description</Label><Textarea {...register('metaDescription')} /></div>
        </div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : blog ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
