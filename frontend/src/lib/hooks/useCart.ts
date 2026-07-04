'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api/cart';
import { useAuthContext } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import type { Cart } from '@/lib/types';

export function useCart() {
  const { isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('cart');

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    enabled: isAuthenticated,
    retry: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const addMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
      variantId,
    }: {
      productId: string;
      quantity?: number;
      variantId?: string;
    }) => cartApi.addItem(productId, quantity, variantId),
    onSuccess: () => {
      invalidate();
      toast({ title: t('addedToCart') });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateItem(id, quantity),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => cartApi.removeItem(id),
    onSuccess: () => {
      invalidate();
      toast({ title: t('removedFromCart') });
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: invalidate,
  });

  const cart = cartQuery.data as Cart | undefined;

  return {
    cart,
    items: cart?.items ?? [],
    itemCount: cart?.itemCount ?? 0,
    subtotal: cart?.subtotal ?? 0,
    isLoading: cartQuery.isLoading,
    addItem: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    clearCart: clearMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
}
