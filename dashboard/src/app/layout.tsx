import type { Metadata } from 'next';
import { BRAND_ICONS } from '@alshisr/shared';
import './globals.css';

export const metadata: Metadata = {
  icons: BRAND_ICONS,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
