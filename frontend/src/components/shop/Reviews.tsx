'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { reviewsApi } from '@/lib/api/products';
import { Skeleton } from '@/components/ui/skeleton';
import { FiStar } from 'react-icons/fi';
import { cn } from '@/lib/utils/cn';

interface ReviewsProps {
  productId: string;
}

export function Reviews({ productId }: ReviewsProps) {
  const t = useTranslations('product');
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.getByProduct(productId),
  });

  const reviews = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return <p className="text-muted-foreground">{t('noReviews')}</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <article key={review.id} className="border-b pb-6 last:border-0">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="font-medium">
                {review.user.firstName} {review.user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-0.5 text-secondary">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={cn('h-4 w-4', i < review.rating && 'fill-current')}
                />
              ))}
            </div>
          </div>
          {review.title && <h4 className="mb-1 font-medium">{review.title}</h4>}
          {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
        </article>
      ))}
    </div>
  );
}
