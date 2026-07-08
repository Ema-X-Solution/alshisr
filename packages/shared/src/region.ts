export const APP_REGION = {
  currency: 'OMR',
  countryCode: 'OM',
  countryNameEn: 'Oman',
  countryNameAr: 'سلطنة عمان',
  localeAr: 'ar-OM',
  localeEn: 'en-OM',
  currencyLabelAr: 'ر.ع.',
  currencyLabelEn: 'OMR',
} as const;

export type AppLocaleTag = typeof APP_REGION.localeAr | typeof APP_REGION.localeEn;

export function getRegionLocale(locale: 'ar' | 'en'): AppLocaleTag {
  return locale === 'ar' ? APP_REGION.localeAr : APP_REGION.localeEn;
}
