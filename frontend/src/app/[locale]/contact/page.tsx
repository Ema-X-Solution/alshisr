'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { contactApi } from '@/lib/api/cms';
import { extractErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const t = useTranslations('contact');
  const tVal = useTranslations('validation');
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: contactApi.submit,
    onSuccess: () => {
      toast({ title: t('success') });
      reset();
    },
    onError: (error) => toast({ title: extractErrorMessage(error), variant: 'destructive' }),
  });

  return (
    <div className="section-padding mx-auto max-w-2xl">
      <h1 className="font-display mb-2 text-4xl font-bold text-primary">{t('title')}</h1>
      <p className="mb-10 text-muted-foreground">{t('subtitle')}</p>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div>
          <Label htmlFor="name">{t('name')}</Label>
          <Input id="name" {...register('name')} className="mt-1" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{tVal('required')}</p>}
        </div>
        <div>
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register('email')} className="mt-1" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{tVal('email')}</p>}
        </div>
        <div>
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input id="phone" {...register('phone')} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="subject">{t('subject')}</Label>
          <Input id="subject" {...register('subject')} className="mt-1" />
          {errors.subject && <p className="mt-1 text-xs text-destructive">{tVal('required')}</p>}
        </div>
        <div>
          <Label htmlFor="message">{t('message')}</Label>
          <Textarea id="message" {...register('message')} className="mt-1" rows={6} />
          {errors.message && <p className="mt-1 text-xs text-destructive">{tVal('required')}</p>}
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting || mutation.isPending}>
          {t('send')}
        </Button>
      </form>
    </div>
  );
}
