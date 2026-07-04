'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { notificationsApi } from '@/lib/api/cms';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocaleField } from '@/lib/hooks/useLocaleField';
import type { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const { isAuthenticated } = useAuth();
  const { field } = useLocaleField();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll(),
    enabled: isAuthenticated,
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = (data?.data as Notification[] | undefined) ?? data ?? [];

  if (!isAuthenticated) {
    return (
      <div className="section-padding mx-auto max-w-lg text-center">
        <Button asChild><Link href="/login">Login</Link></Button>
      </div>
    );
  }

  return (
    <div className="section-padding mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-primary">{t('title')}</h1>
        <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()}>
          {t('markAllRead')}
        </Button>
      </div>
      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : !notifications.length ? (
        <p className="text-center text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: Notification) => (
            <div
              key={n.id}
              className={`rounded-sm border p-4 ${!n.isRead ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              <p className="font-medium">{field(n, 'title') || n.title}</p>
              <p className="text-sm text-muted-foreground">{field(n, 'message') || n.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
