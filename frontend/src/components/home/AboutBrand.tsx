'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ABOUT_BRAND_IMAGE = '/about/AboutBrand._image.jpeg';

export function AboutBrand() {
  const t = useTranslations('home');

  return (
    <section className="section-padding overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] overflow-hidden bg-primary/5"
        >
          <Image
            src={ABOUT_BRAND_IMAGE}
            alt={t('aboutBrand')}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover rounded-lg"
          />
          <div className="pointer-events-none  absolute inset-8 border border-secondary/40" />
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
