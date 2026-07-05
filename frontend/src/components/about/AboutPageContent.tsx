'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

function SectionAccent({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  return (
    <span
      className={`block h-16 w-1 shrink-0 rounded-full sm:h-20 ${
        variant === 'light' ? 'bg-secondary' : 'bg-primary'
      }`}
      aria-hidden
    />
  );
}

function ImageSkeleton({ variant = 'red' }: { variant?: 'red' | 'light' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border-2 lg:max-w-none ${
        variant === 'red' ? 'border-primary-foreground/20' : 'border-primary/20'
      }`}
    >
      <Skeleton
        className={`h-full w-full rounded-none ${
          variant === 'red' ? 'bg-primary-foreground/15' : 'bg-muted'
        }`}
      />
    </motion.div>
  );
}

function RedSection({
  title,
  children,
  reverse = false,
}: {
  title: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="overflow-hidden bg-primary text-primary-foreground">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 md:gap-12 lg:grid-cols-2 lg:px-8 lg:py-20 ${
          reverse ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <ImageSkeleton variant="red" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 sm:gap-6"
        >
          <SectionAccent variant="light" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl md:text-4xl">{title}</h2>
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LightSection({
  title,
  children,
  reverse = false,
}: {
  title: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="bg-background text-foreground">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 md:gap-12 lg:grid-cols-2 lg:px-8 lg:py-20 ${
          reverse ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <ImageSkeleton variant="light" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 sm:gap-6"
        >
          <SectionAccent variant="dark" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display mb-4 text-2xl font-bold text-primary sm:mb-6 sm:text-3xl md:text-4xl">
              {title}
            </h2>
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function AboutPageContent() {
  const t = useTranslations('about');
  const goals = t.raw('goals.items') as string[];

  return (
    <div className="pb-0">
      <LightSection title={t('whoWeAre.title')}>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          {t('whoWeAre.text')}
        </p>
      </LightSection>

      <RedSection title={t('visionMission.title')} reverse>
        <div className="space-y-5 text-sm leading-relaxed text-primary-foreground/90 sm:text-base md:text-lg">
          <p>
            <span className="font-semibold text-secondary">{t('visionMission.visionLabel')}</span>{' '}
            {t('visionMission.vision')}
          </p>
          <p>
            <span className="font-semibold text-secondary">{t('visionMission.missionLabel')}</span>{' '}
            {t('visionMission.mission')}
          </p>
        </div>
      </RedSection>

      <LightSection title={t('goals.title')} reverse>
        <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:space-y-4 sm:text-base">
          {goals.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LightSection>
    </div>
  );
}
