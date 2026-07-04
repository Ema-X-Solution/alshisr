'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cmsApi } from '@/lib/api/cms';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import type { Blog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const t = useTranslations('blog');
  const { field } = useLocaleField();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => cmsApi.getBlogs(page, 9),
  });

  const posts = data?.data ?? [];

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <h1 className="font-display mb-10 text-4xl font-bold text-primary">{t('title')}</h1>
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Blog) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted">
                    {post.image && (
                      <Image src={post.image} alt={field(post, 'title')} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="font-display text-xl font-semibold group-hover:text-primary">
                      {field(post, 'title')}
                    </h2>
                    {field(post, 'excerpt') && (
                      <p className="mt-2 line-clamp-2 text-muted-foreground">{field(post, 'excerpt')}</p>
                    )}
                    <span className="mt-3 inline-block text-sm text-secondary">{t('readMore')} →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <Button variant="outline" disabled={!data.meta.hasPrevPage} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" disabled={!data.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
