'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  if (!sorted.length) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="aspect-square overflow-hidden bg-muted"
      >
        {sorted.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.alt || productName}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {sorted.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          freeMode
          watchSlidesProgress
        >
          {sorted.map((image) => (
            <SwiperSlide key={image.id}>
              <div className={cn('relative aspect-square cursor-pointer overflow-hidden border-2 border-transparent')}>
                <Image
                  src={image.url}
                  alt={image.alt || productName}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
