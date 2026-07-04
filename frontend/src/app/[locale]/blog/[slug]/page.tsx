import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/api/server';
import { localizedField, type Blog } from '@/lib/types';
import type { Locale } from '@/i18n/routing';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  try {
    const post = await serverFetch<Blog>(`/cms/blogs/slug/${slug}`, { next: { revalidate: 3600 } });
    return {
      title: localizedField(post, 'title', locale as Locale),
      description: localizedField(post, 'excerpt', locale as Locale),
    };
  } catch {
    return { title: 'Blog' };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  let post: Blog;
  try {
    post = await serverFetch<Blog>(`/cms/blogs/slug/${slug}`, { next: { revalidate: 3600 } });
  } catch {
    notFound();
  }

  const title = localizedField(post, 'title', locale as Locale);
  const content = localizedField(post, 'content', locale as Locale);

  return (
    <article className="section-padding mx-auto max-w-3xl">
      {post.image && (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden">
          <Image src={post.image} alt={title} fill className="object-cover" priority sizes="100vw" />
        </div>
      )}
      <h1 className="font-display mb-4 text-4xl font-bold text-primary">{title}</h1>
      <div className="mb-8 flex gap-4 text-sm text-muted-foreground">
        {post.publishedAt && (
          <time>{t('publishedAt')} {new Date(post.publishedAt).toLocaleDateString(locale)}</time>
        )}
        {post.author && <span>{t('author')} {post.author}</span>}
      </div>
      <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="text-sm font-medium">{t('tags')}:</span>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-sm">{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}
