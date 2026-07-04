'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function AboutBrand() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <section className="section-padding overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] bg-primary/5"
        >
          <div className="absolute inset-8 border border-secondary/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-bold text-primary/20 md:text-8xl">
              {tCommon('siteName')}
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeading title={t('aboutBrand')} align="start" className="mb-6" />
          <p className="text-lg leading-relaxed text-muted-foreground">{t('aboutBrandText')}</p>
          <Button asChild className="mt-8" variant="outline">
            <Link href="/about">{t('aboutBrand')}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
