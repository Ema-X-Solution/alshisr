import type { Metadata } from 'next';
import { BRAND_ICONS } from '@alshisr/shared';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: BRAND_ICONS,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
