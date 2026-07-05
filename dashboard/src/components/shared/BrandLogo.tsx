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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BRAND_ASSETS.logo}
      alt={BRAND.name}
      className={className}
      height={height}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
