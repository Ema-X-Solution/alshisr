'use client';

import { useRouter } from '@/i18n/navigation';
import { useQueryClient } from '@tanstack/react-query';

export function useFormNavigation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const navigateAfterSave = async (path: string, queryKeys: string | string[]) => {
    const keys = Array.isArray(queryKeys) ? queryKeys : [queryKeys];
    await Promise.all(
      keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
    );
    router.push(path);
  };

  return { navigateAfterSave };
}
