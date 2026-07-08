'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlineCheck } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { reviewsApi } from '@/lib/services';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Review } from '@/lib/types';

export default function ReviewsPage() {
  const t = useTranslations('reviews');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tContact = useTranslations('contact');
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reviews-pending', page],
    queryFn: () => reviewsApi.listPending({ page, limit: 10 }),
  });

  const approveMutation = useMutation({
    mutationFn: reviewsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews-pending'] });
      toast({ title: t('reviewApproved') });
    },
  });

  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: 'product',
      header: t('product'),
      cell: ({ row }) => row.original.product?.name || '—',
    },
    {
      accessorKey: 'user',
      header: t('customer'),
      cell: ({ row }) => row.original.user ? `${row.original.user.firstName} ${row.original.user.lastName}` : '—',
    },
    {
      accessorKey: 'rating',
      header: t('rating'),
      cell: ({ row }) => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < row.original.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
          ))}
        </div>
      ),
    },
    { accessorKey: 'comment', header: t('comment'), cell: ({ row }) => <span className="line-clamp-2 max-w-xs">{row.original.comment || '—'}</span> },
    { accessorKey: 'createdAt', header: tContact('date'), cell: ({ row }) => formatDateTime(row.original.createdAt) },
    {
      id: 'actions',
      header: tCommon('actions'),
      cell: ({ row }) => (
        <Button size="sm" onClick={() => approveMutation.mutate(row.original.id)} disabled={approveMutation.isPending}>
          <HiOutlineCheck className="h-4 w-4" /> {t('approve')}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('pendingTitle')}</h2>
        <Badge variant="secondary">{t('pendingCount', { count: data?.meta?.total || 0 })}</Badge>
      </div>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} onPageChange={setPage} />
    </div>
  );
}
