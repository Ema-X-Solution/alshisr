'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { newsletterApi } from '@/lib/api/cms';
import { extractErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils/cn';

interface NewsletterProps {
  variant?: 'default' | 'footer';
}

export function Newsletter({ variant = 'default' }: NewsletterProps) {
  const t = useTranslations(variant === 'footer' ? 'footer' : 'home');
  const tCommon = useTranslations('common');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: () => newsletterApi.subscribe(email),
    onSuccess: () => {
      toast({ title: tCommon('success'), description: t('newsletterText') });
      setEmail('');
    },
    onError: (error) => {
      toast({ title: tCommon('error'), description: extractErrorMessage(error), variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) subscribeMutation.mutate();
  };

  const isFooter = variant === 'footer';

  return (
    <div className={cn(!isFooter && 'section-padding mx-auto max-w-xl text-center')}>
      {!isFooter && (
        <>
          <h2 className="font-display mb-3 text-3xl font-semibold text-primary">{t('newsletter')}</h2>
          <p className="mb-6 text-muted-foreground">{t('newsletterText')}</p>
        </>
      )}
      {isFooter && (
        <>
          <h3 className="font-display mb-4 text-xl font-semibold">{t('newsletter')}</h3>
          <p className="mb-4 text-sm text-primary-foreground/80">{t('newsletterText')}</p>
        </>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          required
          className={cn(isFooter && 'border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60')}
        />
        <Button
          type="submit"
          variant={isFooter ? 'secondary' : 'default'}
          disabled={subscribeMutation.isPending}
        >
          {t('subscribe')}
        </Button>
      </form>
    </div>
  );
}
