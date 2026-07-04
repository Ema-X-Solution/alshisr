import { CmsPageContent } from '@/components/shared/CmsPageContent';

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  return <CmsPageContent params={params} slug="about" titleNamespace="about" titleKey="title" />;
}
