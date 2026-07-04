import { CmsPageContent } from '@/components/shared/CmsPageContent';

export default function RefundPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  return <CmsPageContent params={params} slug="refund-policy" titleKey="refundPolicy" />;
}
