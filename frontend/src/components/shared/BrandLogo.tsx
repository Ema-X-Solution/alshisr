import Image from 'next/image';
import { BRAND, BRAND_ASSETS } from '@alshisr/shared';

interface BrandLogoProps {
  locale?: 'ar' | 'en';
  className?: string;
  height?: number;
  priority?: boolean;
}

export function BrandLogo({
  locale = 'en',
  className = 'h-35 w-auto md:h-35',
  height = 40,
  priority = false,
}: BrandLogoProps) {
  const alt = locale === 'ar' ? BRAND.nameAr : BRAND.name;

  return (
    <Image
      src={BRAND_ASSETS.logo}
      alt={alt}
      width={Math.round(height * 3)}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
