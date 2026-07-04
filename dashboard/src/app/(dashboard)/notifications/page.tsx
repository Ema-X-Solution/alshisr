'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { notificationsApi } from '@/lib/services';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.list({ page, limit: 20 }),
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({ title: 'All notifications marked as read' });
    },
  });

  const columns: ColumnDef<Notification>[] = [
    { accessorKey: 'title', header: 'Title', cell: ({ row }) => <span className={!row.original.isRead ? 'font-semibold' : ''}>{row.original.title}</span> },
    { accessorKey: 'message', header: 'Message', cell: ({ row }) => <span className="line-clamp-2 max-w-md">{row.original.message}</span> },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge> },
    {
      accessorKey: 'isRead',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.isRead ? 'secondary' : 'default'}>{row.original.isRead ? 'Read' : 'Unread'}</Badge>,
    },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ row }) => formatDateTime(row.original.createdAt) },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => !row.original.isRead ? (
        <Button size="sm" variant="outline" onClick={() => markReadMutation.mutate(row.original.id)}>Mark Read</Button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Notifications' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button variant="outline" onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
          Mark All Read
        </Button>
      </div>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} onPageChange={setPage} />
    </div>
  );
}
