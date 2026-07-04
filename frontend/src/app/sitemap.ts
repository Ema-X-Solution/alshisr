import type { MetadataRoute } from 'next';
import { serverFetch } from '@/lib/api/server';
import type { PaginatedResponse, Product, Blog } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const locales = ['ar', 'en'];

  const staticPaths = [
    '',
    '/shop',
    '/categories',
    '/offers',
    '/about',
    '/blog',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/shipping-policy',
  ];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1 : 0.8,
    })),
  );

  let productEntries: MetadataRoute.Sitemap = [];
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const products = await serverFetch<PaginatedResponse<Product>>('/products', {
      params: { limit: 100 },
      next: { revalidate: 3600 },
    });
    productEntries = locales.flatMap((locale) =>
      products.data.map((product) => ({
        url: `${baseUrl}/${locale}/shop/${product.slug}`,
        lastModified: new Date(product.updatedAt ?? Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    );
  } catch {
    // API may be unavailable at build time
  }

  try {
    const blogs = await serverFetch<PaginatedResponse<Blog>>('/cms/blogs', {
      params: { limit: 100 },
      next: { revalidate: 3600 },
    });
    blogEntries = locales.flatMap((locale) =>
      blogs.data.map((blog) => ({
        url: `${baseUrl}/${locale}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt ?? blog.publishedAt ?? Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );
  } catch {
    // ignore
  }

  return [...staticEntries, ...productEntries, ...blogEntries];
}
