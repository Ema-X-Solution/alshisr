'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api/cms';
import { useAuthContext } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import type { WishlistItem } from '@/lib/types';

export function useWishlist() {
  const { isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('wishlist');

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.get,
    enabled: isAuthenticated,
    retry: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['wishlist'] });

  const toggleMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.toggle(productId),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onSuccess: () => {
      invalidate();
      toast({ title: t('removed') });
    },
  });

  const addMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.add(productId),
    onSuccess: () => {
      invalidate();
      toast({ title: t('added') });
    },
  });

  const items = (wishlistQuery.data as WishlistItem[] | undefined) ?? [];
  const productIds = new Set(items.map((item) => item.productId));

  return {
    items,
    count: items.length,
    isLoading: wishlistQuery.isLoading,
    isInWishlist: (productId: string) => productIds.has(productId),
    toggle: toggleMutation.mutateAsync,
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
  };
}
