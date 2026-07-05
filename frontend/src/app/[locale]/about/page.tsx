import { getTranslations } from 'next-intl/server';
import { AboutPageContent } from '@/components/about/AboutPageContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('whoWeAre.text'),
  };
}

export default function AboutPage() {
  return <AboutPageContent />;
}
