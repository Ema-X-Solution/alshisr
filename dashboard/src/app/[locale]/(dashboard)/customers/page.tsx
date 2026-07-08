'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { usersApi } from '@/lib/services';
import { formatDate } from '@/lib/utils';
import type { User } from '@/lib/types';

export default function CustomersPage() {
  const t = useTranslations('customers');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => usersApi.list({ page, limit: 10, search, role: 'CUSTOMER' }),
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.firstName} {row.original.lastName}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: 'phone', header: t('phone'), cell: ({ row }) => row.original.phone || '—' },
    { accessorKey: 'ordersCount', header: t('orders'), cell: ({ row }) => row.original.ordersCount ?? 0 },
    {
      accessorKey: 'isActive',
      header: tCommon('status'),
      cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? tCommon('active') : tCommon('inactive')}</Badge>,
    },
    { accessorKey: 'createdAt', header: t('joined'), cell: ({ row }) => row.original.createdAt ? formatDate(row.original.createdAt) : '—' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} searchValue={search} onSearchChange={setSearch} onPageChange={setPage} searchPlaceholder={t('search')} />
    </div>
  );
}
