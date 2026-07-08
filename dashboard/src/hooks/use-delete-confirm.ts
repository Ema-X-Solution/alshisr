'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getApiErrorMessage } from '@/lib/api-error';

interface UseDeleteConfirmOptions {
  deleteFn: (id: string) => Promise<unknown>;
  queryKey: string | string[];
  successMessage: string;
  fallbackErrorMessage: string;
  conflictMessages?: Record<string, string>;
}

export function useDeleteConfirm({
  deleteFn,
  queryKey,
  successMessage,
  fallbackErrorMessage,
  conflictMessages = {},
}: UseDeleteConfirmOptions) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);

  const mutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      const keys = Array.isArray(queryKey) ? queryKey : [queryKey];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      toast({ title: successMessage });
      setTarget(null);
    },
    onError: (error) => {
      const apiMessage = getApiErrorMessage(error, fallbackErrorMessage);
      const description = conflictMessages[apiMessage] ?? apiMessage;
      toast({
        title: fallbackErrorMessage,
        description,
        variant: 'destructive',
      });
    },
  });

  const openDelete = (id: string, name: string) => setTarget({ id, name });
  const closeDelete = () => {
    if (!mutation.isPending) setTarget(null);
  };
  const confirmDelete = () => {
    if (target) mutation.mutate(target.id);
  };

  return {
    deleteDialogProps: {
      open: !!target,
      onOpenChange: (open: boolean) => {
        if (!open) closeDelete();
      },
      itemName: target?.name,
      onConfirm: confirmDelete,
      isLoading: mutation.isPending,
    },
    openDelete,
    isDeleting: mutation.isPending,
  };
}
