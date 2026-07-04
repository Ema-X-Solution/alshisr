'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Link } from '@/i18n/navigation';
import { cmsApi } from '@/lib/api/cms';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroSlider() {
  const { field } = useLocaleField();
  const { data: sliders, isLoading } = useQuery({
    queryKey: ['sliders'],
    queryFn: cmsApi.getSliders,
  });

  if (isLoading) {
    return <Skeleton className="aspect-[16/9] w-full md:aspect-[21/9]" />;
  }

  if (!sliders?.length) return null;

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-swiper"
      >
        {sliders.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <Image
                src={slide.mobileImage || slide.image}
                alt={field(slide, 'title')}
                fill
                priority
                className="object-cover md:hidden"
                sizes="100vw"
              />
              <Image
                src={slide.image}
                alt={field(slide, 'title')}
                fill
                priority
                className="hidden object-cover md:block"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center text-white md:pb-24">
                <h1 className="font-display mb-4 max-w-3xl text-4xl font-bold md:text-6xl">
                  {field(slide, 'title')}
                </h1>
                {field(slide, 'subtitle') && (
                  <p className="mb-8 max-w-xl text-lg text-white/90 md:text-xl">
                    {field(slide, 'subtitle')}
                  </p>
                )}
                {slide.link && (
                  <Button asChild size="lg" variant="secondary">
                    <Link href={slide.link.startsWith('/') ? slide.link : '/shop'}>
                      {field(slide, 'buttonText') || 'Shop Now'}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
