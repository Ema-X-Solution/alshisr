'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cmsApi } from '@/lib/api/cms';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function Testimonials() {
  const t = useTranslations('home');
  const { field } = useLocaleField();
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: cmsApi.getTestimonials,
  });

  if (isLoading) {
    return (
      <section className="section-padding bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="mx-auto mb-10 h-10 w-64" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials?.length) return null;

  return (
    <section className="section-padding bg-muted/50">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t('testimonials')} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-sm border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1 text-secondary">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FiStar key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                &ldquo;{field(item, 'content')}&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                {item.avatar && (
                  <Image src={item.avatar} alt={field(item, 'name')} width={48} height={48} className="rounded-full" />
                )}
                <div>
                  <cite className="font-display not-italic font-semibold">{field(item, 'name')}</cite>
                  {field(item, 'role') && (
                    <p className="text-sm text-muted-foreground">{field(item, 'role')}</p>
                  )}
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
