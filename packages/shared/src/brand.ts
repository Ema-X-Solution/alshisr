export const BRAND_ASSETS = {
  logo: '/logo_alshisr.png',
  favicon: '/favicon.ico',
  manifest: '/favicons/manifest.webmanifest',
  favicons: {
    ico: '/favicons/favicon.ico',
    png16: '/favicons/favicon-16x16.png',
    png32: '/favicons/favicon-32x32.png',
    png48: '/favicons/favicon-48x48.png',
    apple: '/favicons/apple-touch-icon.png',
    apple180: '/favicons/apple-touch-icon-180x180.png',
    android192: '/favicons/android-chrome-192x192.png',
    android512: '/favicons/android-chrome-512x512.png',
  },
} as const;

export const BRAND_ICONS = {
  icon: [
    { url: BRAND_ASSETS.favicon },
    { url: BRAND_ASSETS.favicons.png16, sizes: '16x16', type: 'image/png' },
    { url: BRAND_ASSETS.favicons.png32, sizes: '32x32', type: 'image/png' },
    { url: BRAND_ASSETS.favicons.png48, sizes: '48x48', type: 'image/png' },
  ],
  apple: [
    { url: BRAND_ASSETS.favicons.apple },
    { url: BRAND_ASSETS.favicons.apple180, sizes: '180x180', type: 'image/png' },
  ],
  other: [{ rel: 'manifest', url: BRAND_ASSETS.manifest }],
};
