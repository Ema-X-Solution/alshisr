import { CmsPageContent } from '@/components/shared/CmsPageContent';

export default function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  return <CmsPageContent params={params} slug="privacy" titleKey="privacy" />;
}
