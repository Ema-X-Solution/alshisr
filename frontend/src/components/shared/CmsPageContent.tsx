import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/api/server';
import { localizedField, type Page } from '@/lib/types';
import type { Locale } from '@/i18n/routing';

interface CmsPageContentProps {
  params: Promise<{ locale: string }>;
  slug: string;
  titleNamespace?: 'pages' | 'about';
  titleKey?: string;
}

export async function CmsPageContent({
  params,
  slug,
  titleNamespace = 'pages',
  titleKey,
}: CmsPageContentProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: titleNamespace });

  let page: Page;
  try {
    page = await serverFetch<Page>(`/cms/pages/slug/${slug}`, { next: { revalidate: 3600 } });
  } catch {
    notFound();
  }

  const title = localizedField(page, 'title', locale as Locale) || (titleKey ? t(titleKey) : '');
  const content = localizedField(page, 'content', locale as Locale);

  return (
    <div className="section-padding mx-auto max-w-4xl">
      <h1 className="font-display mb-8 text-4xl font-bold text-primary">{title}</h1>
      <div
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
