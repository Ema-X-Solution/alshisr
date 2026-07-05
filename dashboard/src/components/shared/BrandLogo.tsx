import Image from 'next/image';
import { BRAND, BRAND_ASSETS } from '@alshisr/shared';

interface BrandLogoProps {
  className?: string;
  height?: number;
  priority?: boolean;
}

export function BrandLogo({
  className = 'h-9 w-auto',
  height = 36,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND_ASSETS.logo}
      alt={BRAND.name}
      width={Math.round(height * 3)}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
