'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cmsApi, settingsApi } from '@/lib/api/cms';
import { productsApi } from '@/lib/api/products';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function InstagramGallery() {
  const t = useTranslations('home');
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getPublic,
  });
  const { data: banners, isLoading: bannersLoading } = useQuery({
    queryKey: ['banners', 'instagram'],
    queryFn: () => cmsApi.getBanners('instagram'),
  });
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['instagram-products'],
    queryFn: () => productsApi.getAll({ featured: true, limit: 6 }),
    enabled: !banners?.length,
  });

  const isLoading = bannersLoading || productsLoading;
  const instagramUrl = (settings?.social?.instagram as string) || 'https://instagram.com/alshisr';

  const images =
    banners?.map((b) => ({ id: b.id, url: b.image, alt: b.title })) ??
    productsData?.data.flatMap((p) =>
      p.images.slice(0, 1).map((img) => ({ id: img.id, url: img.url, alt: p.name })),
    ) ??
    [];

  if (isLoading) {
    return (
      <section className="section-padding mx-auto max-w-7xl">
        <Skeleton className="mx-auto mb-10 h-10 w-64" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </section>
    );
  }

  if (!images.length) return null;

  return (
    <section className="section-padding mx-auto max-w-7xl">
      <SectionHeading
        title={t('instagram')}
        subtitle={
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary hover:underline"
          >
            <FaInstagram className="h-5 w-5" />
            @alshisr
          </a>
        }
      />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        {images.slice(0, 6).map((img, index) => (
          <motion.a
            key={img.id}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 16vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors group-hover:bg-primary/40">
              <FaInstagram className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
