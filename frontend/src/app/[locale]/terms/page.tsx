import { CmsPageContent } from '@/components/shared/CmsPageContent';

export default function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  return <CmsPageContent params={params} slug="terms" titleKey="terms" />;
}
