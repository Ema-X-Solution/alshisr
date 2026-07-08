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
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Faq } from '@/lib/types';

const schema = z.object({
  question: z.string().min(1),
  questionAr: z.string().min(1),
  answer: z.string().min(1),
  answerAr: z.string().min(1),
  category: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface FaqFormProps {
  faq?: Faq;
  onSubmit: (data: FormData) => Promise<unknown>;
}

export function FaqForm({ faq, onSubmit }: FaqFormProps) {
  const router = useRouter();
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: faq?.question || '',
      questionAr: faq?.questionAr || '',
      answer: faq?.answer || '',
      answerAr: faq?.answerAr || '',
      category: faq?.category || '',
      sortOrder: faq?.sortOrder || 0,
      isActive: faq?.isActive ?? true,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({
        title: faq
          ? tForms('updated', { item: tForms('itemFaq') })
          : tForms('created', { item: tForms('itemFaq') }),
      });
      await navigateAfterSave('/faq', 'faq');
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemFaq') }), variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection title="FAQ">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>{tForms('questionEn')}</Label><Input {...register('question')} /></div>
          <div className="space-y-2"><Label>{tForms('questionAr')}</Label><Input dir="rtl" {...register('questionAr')} /></div>
          <div className="space-y-2"><Label>{tForms('category')}</Label><Input {...register('category')} placeholder="general, shipping, etc." /></div>
          <div className="space-y-2"><Label>{tForms('sortOrder')}</Label><Input type="number" {...register('sortOrder')} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', v)} />
            <Label>{tCommon('active')}</Label>
          </div>
        </div>
        <div className="space-y-2"><Label>{tForms('answerEn')}</Label><Textarea rows={4} {...register('answer')} /></div>
        <div className="space-y-2"><Label>{tForms('answerAr')}</Label><Textarea dir="rtl" rows={4} {...register('answerAr')} /></div>
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : faq ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
