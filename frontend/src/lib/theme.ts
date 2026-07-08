import { COLORS } from '@alshisr/shared';
import type { CSSProperties } from 'react';

export type ThemeColorKey =
  | 'primary'
  | 'secondary'
  | 'lavender'
  | 'saffron'
  | 'olive'
  | 'sage'
  | 'brown'
  | 'background'
  | 'text';

const DEFAULT_COLORS: Record<ThemeColorKey, string> = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  lavender: COLORS.lavender,
  saffron: COLORS.saffron,
  olive: COLORS.olive,
  sage: COLORS.sage,
  brown: COLORS.brown,
  background: COLORS.background,
  text: COLORS.text,
};

/** Convert `#RRGGBB` / `#RGB` to Tailwind HSL channel form: `H S% L%`. */
export function hexToHsl(hex: string): string | null {
  const cleaned = hex.trim().replace(/^#/, '');
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cleaned)) return null;

  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function resolveHex(value: unknown, fallback: string): string {
  if (typeof value === 'string' && hexToHsl(value)) return value.trim();
  return fallback;
}

/**
 * Build inline CSS custom properties from public settings `colors` group.
 * Falls back to shared COLORS defaults when a key is missing or invalid.
 */
export function buildThemeStyle(
  colors?: Record<string, unknown> | null,
): CSSProperties {
  const primary = resolveHex(colors?.primary, DEFAULT_COLORS.primary);
  const secondary = resolveHex(colors?.secondary, DEFAULT_COLORS.secondary);
  const background = resolveHex(colors?.background, DEFAULT_COLORS.background);
  const text = resolveHex(colors?.text, DEFAULT_COLORS.text);
  const lavender = resolveHex(colors?.lavender, DEFAULT_COLORS.lavender);
  const saffron = resolveHex(colors?.saffron, DEFAULT_COLORS.saffron);
  const olive = resolveHex(colors?.olive, DEFAULT_COLORS.olive);
  const sage = resolveHex(colors?.sage, DEFAULT_COLORS.sage);
  const brown = resolveHex(colors?.brown, DEFAULT_COLORS.brown);

  const style: Record<string, string> = {
    '--primary': hexToHsl(primary)!,
    '--ring': hexToHsl(primary)!,
    '--secondary': hexToHsl(secondary)!,
    '--accent': hexToHsl(secondary)!,
    '--background': hexToHsl(background)!,
    '--foreground': hexToHsl(text)!,
    '--card-foreground': hexToHsl(text)!,
    '--popover-foreground': hexToHsl(text)!,
    '--secondary-foreground': hexToHsl(text)!,
    '--accent-foreground': hexToHsl(text)!,
    '--primary-foreground': hexToHsl(background)!,
    '--lavender': hexToHsl(lavender)!,
    '--saffron': hexToHsl(saffron)!,
    '--olive': hexToHsl(olive)!,
    '--sage': hexToHsl(sage)!,
    '--brown': hexToHsl(brown)!,
  };

  return style as CSSProperties;
}
