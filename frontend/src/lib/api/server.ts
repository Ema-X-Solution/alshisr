import { getApiBaseUrl } from '@alshisr/shared';

const API_BASE = getApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export async function serverFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(url.toString(), {
    headers,
    cache: options.cache,
    next: options.next,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const json = await response.json();
  return (json.data ?? json) as T;
}
