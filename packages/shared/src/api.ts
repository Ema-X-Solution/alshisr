const DEFAULT_API_ORIGIN = 'https://alshisr.com';

/** Normalize env API URL to `…/api/v1` (handles values with or without the suffix). */
export function getApiBaseUrl(envUrl?: string): string {
  const raw = (envUrl || DEFAULT_API_ORIGIN).trim().replace(/\/$/, '');
  if (raw.endsWith('/api/v1')) {
    return raw;
  }
  return `${raw}/api/v1`;
}
