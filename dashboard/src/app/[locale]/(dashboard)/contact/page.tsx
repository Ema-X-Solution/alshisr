'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { contactApi } from '@/lib/services';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { ContactMessage } from '@/lib/types';

export default function ContactPage() {
  const t = useTranslations('contact');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['contact', page],
    queryFn: () => contactApi.list({ page, limit: 10 }),
  });

  const markReadMutation = useMutation({
    mutationFn: contactApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      toast({ title: t('markedRead') });
    },
  });

  const columns: ColumnDef<ContactMessage>[] = [
    {
      accessorKey: 'name',
      header: t('from'),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: 'subject', header: t('subject') },
    { accessorKey: 'message', header: t('message'), cell: ({ row }) => <span className="line-clamp-2 max-w-xs">{row.original.message}</span> },
    {
      accessorKey: 'isRead',
      header: tCommon('status'),
      cell: ({ row }) => <Badge variant={row.original.isRead ? 'secondary' : 'default'}>{row.original.isRead ? t('read') : t('unread')}</Badge>,
    },
    { accessorKey: 'createdAt', header: t('date'), cell: ({ row }) => formatDateTime(row.original.createdAt) },
    {
      id: 'actions',
      header: tCommon('actions'),
      cell: ({ row }) => !row.original.isRead ? (
        <Button size="sm" variant="outline" onClick={() => markReadMutation.mutate(row.original.id)}>
          <HiOutlineMailOpen className="h-4 w-4" /> {t('markRead')}
        </Button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} onPageChange={setPage} searchPlaceholder={t('search')} />
    </div>
  );
}
