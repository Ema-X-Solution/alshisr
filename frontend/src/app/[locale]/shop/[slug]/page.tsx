import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/api/server';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { ProductInfo } from '@/components/shop/ProductInfo';
import { Reviews } from '@/components/shop/Reviews';
import { RelatedProducts } from '@/components/shop/RelatedProducts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { localizedField, type Product } from '@/lib/types';
import type { Locale } from '@/i18n/routing';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  try {
    const product = await serverFetch<Product>(`/products/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    const name = localizedField(product, 'name', locale as Locale);
    const description = localizedField(product, 'shortDescription', locale as Locale);
    return {
      title: name,
      description,
      openGraph: {
        title: name,
        description,
        images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
      },
    };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'product' });

  let product: Product;
  try {
    product = await serverFetch<Product>(`/products/slug/${slug}`, {
      next: { revalidate: 60 },
    });
  } catch {
    notFound();
  }

  const name = localizedField(product, 'name', locale as Locale);
  const description = localizedField(product, 'description', locale as Locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku: product.sku,
    image: product.images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'SAR',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={name} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">{t('description')}</TabsTrigger>
            <TabsTrigger value="specs">{t('specifications')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="prose max-w-none mt-6">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-muted-foreground">—</p>
            )}
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            {product.attributes?.length ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="border-b pb-2">
                    <dt className="text-sm text-muted-foreground">
                      {localizedField(attr, 'name', locale as Locale)}
                    </dt>
                    <dd className="font-medium">
                      {localizedField(attr, 'value', locale as Locale)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-muted-foreground">—</p>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Reviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>

      <RelatedProducts slug={slug} />
    </div>
  );
}
