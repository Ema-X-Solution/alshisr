'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { cmsApi } from '@/lib/api/cms';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeading } from '@/components/shared/SectionHeading';

export default function FaqPage() {
  const t = useTranslations('faq');
  const { field } = useLocaleField();
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => cmsApi.getFaqs(),
  });

  return (
    <div className="section-padding mx-auto max-w-3xl">
      <SectionHeading title={t('title')} subtitle={t('subtitle')} />
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {faqs?.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-start font-display text-lg">
                {field(faq, 'question')}
              </AccordionTrigger>
              <AccordionContent>{field(faq, 'answer')}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
