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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormSection, FormActions } from './FormSection';
import { RichTextEditor } from './RichTextEditor';
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
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

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
      toast({
        title: page
          ? tForms('updated', { item: tForms('itemPage') })
          : tForms('created', { item: tForms('itemPage') }),
      });
      await navigateAfterSave('/pages', 'pages');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemPage') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title={tForms('basicInfo')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">{tForms('titleEn')}</Label>
            <Input id="title" {...register('title')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleAr">{tForms('titleAr')}</Label>
            <Input id="titleAr" dir="rtl" {...register('titleAr')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">{tForms('slug')}</Label>
            <Input
              id="slug"
              placeholder={tForms('slugPlaceholder')}
              className="font-mono text-sm"
              {...register('slug')}
            />
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 sm:mt-6">
            <Switch
              id="isPublished"
              checked={watch('isPublished')}
              onCheckedChange={(v) => setValue('isPublished', v)}
            />
            <Label htmlFor="isPublished" className="cursor-pointer font-medium">
              {tCommon('published')}
            </Label>
          </div>
        </div>
      </FormSection>

      <FormSection title={tForms('pageContent')} description={tForms('contentHtmlHint')}>
        <Tabs defaultValue="en" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
            <TabsTrigger value="en">{tForms('contentEn')}</TabsTrigger>
            <TabsTrigger value="ar">{tForms('contentAr')}</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="mt-4">
            <RichTextEditor
              value={watch('content')}
              onChange={(html) => setValue('content', html, { shouldDirty: true, shouldValidate: true })}
              dir="ltr"
              placeholder="Start writing your page content..."
            />
          </TabsContent>
          <TabsContent value="ar" className="mt-4">
            <RichTextEditor
              value={watch('contentAr')}
              onChange={(html) => setValue('contentAr', html, { shouldDirty: true, shouldValidate: true })}
              dir="rtl"
              placeholder="ابدأ بكتابة محتوى الصفحة..."
            />
          </TabsContent>
        </Tabs>
      </FormSection>

      <FormSection title={tForms('seo')}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">{tForms('metaTitle')}</Label>
            <Input id="metaTitle" {...register('metaTitle')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">{tForms('metaDescription')}</Label>
            <Textarea
              id="metaDescription"
              rows={3}
              className="resize-y"
              {...register('metaDescription')}
            />
          </div>
        </div>
      </FormSection>

      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : page ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
