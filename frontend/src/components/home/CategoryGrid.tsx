'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categoriesApi } from '@/lib/api/cms';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category } from '@/lib/types';
import { motion } from 'framer-motion';

export function CategoryGrid() {
  const t = useTranslations('home');
  const { field } = useLocaleField();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const items = (categories as Category[] | undefined)?.filter((c) => !c.parentId) ?? [];

  return (
    <section className="section-padding bg-muted/50">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t('categories')} />
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative block aspect-square overflow-hidden"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={field(category, 'name')}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-display text-lg font-semibold md:text-xl">
                      {field(category, 'name')}
                    </h3>
                    {category._count?.products !== undefined && (
                      <p className="text-sm text-white/80">{category._count.products} products</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
