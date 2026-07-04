'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categoriesApi } from '@/lib/api/cms';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const t = useTranslations('categories');
  const { field } = useLocaleField();
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const categories = (data as Category[] | undefined) ?? [];

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <h1 className="font-display mb-10 text-4xl font-bold text-primary">{t('title')}</h1>
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden"
            >
              {category.image ? (
                <Image src={category.image} alt={field(category, 'name')} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
              ) : (
                <div className="absolute inset-0 bg-primary/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h2 className="font-display text-2xl font-semibold">{field(category, 'name')}</h2>
                {category._count?.products !== undefined && (
                  <p className="text-sm text-white/80">
                    {t('productsCount', { count: category._count.products })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
