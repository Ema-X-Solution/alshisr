'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
  align?: 'start' | 'center';
}

export function SectionHeading({ title, subtitle, className, align = 'center' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">{title}</h2>
      {subtitle && (
        <div className="mt-3 text-muted-foreground md:text-lg">{subtitle}</div>
      )}
      <div className={cn('mt-4 h-0.5 w-16 bg-secondary', align === 'center' && 'mx-auto')} />
    </motion.div>
  );
}
