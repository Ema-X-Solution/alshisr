'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cmsApi } from '@/lib/api/cms';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export function SpecialOffers() {
  const t = useTranslations('home');
  const { field } = useLocaleField();
  const { data: banners, isLoading } = useQuery({
    queryKey: ['banners', 'offers'],
    queryFn: () => cmsApi.getBanners('offers'),
  });

  if (isLoading) {
    return (
      <section className="section-padding mx-auto max-w-7xl">
        <Skeleton className="aspect-[21/9] w-full" />
      </section>
    );
  }

  if (!banners?.length) return null;

  return (
    <section className="section-padding mx-auto max-w-7xl">
      <SectionHeading title={t('offers')} />
      <div className="grid gap-6 md:grid-cols-2">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href={banner.link || '/offers'}
              className="group relative block aspect-[16/9] overflow-hidden"
            >
              <Image
                src={banner.image}
                alt={field(banner, 'title')}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                <h3 className="font-display text-2xl font-bold md:text-3xl">{field(banner, 'title')}</h3>
                {field(banner, 'subtitle') && (
                  <p className="mt-2 text-white/90">{field(banner, 'subtitle')}</p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
