import { CmsPageContent } from '@/components/shared/CmsPageContent';

export default function ShippingPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  return <CmsPageContent params={params} slug="shipping-policy" titleKey="shippingPolicy" />;
}
