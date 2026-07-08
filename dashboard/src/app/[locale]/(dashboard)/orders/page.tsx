'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ordersApi } from '@/lib/services';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '@/lib/constants';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
  const t = useTranslations('orders');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('status');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, search],
    queryFn: () => ordersApi.list({ page, limit: 10, search }),
  });

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'orderNumber',
      header: t('order'),
      cell: ({ row }) => (
        <Link href={`/orders/${row.original.id}`} className="font-medium hover:text-primary">
          #{row.original.orderNumber}
        </Link>
      ),
    },
    {
      accessorKey: 'user',
      header: t('customer'),
      cell: ({ row }) => row.original.user ? `${row.original.user.firstName} ${row.original.user.lastName}` : '—',
    },
    { accessorKey: 'total', header: t('total'), cell: ({ row }) => formatCurrency(row.original.total) },
    {
      accessorKey: 'status',
      header: tCommon('status'),
      cell: ({ row }) => <Badge className={ORDER_STATUS_COLORS[row.original.status]} variant="outline">{tStatus(row.original.status)}</Badge>,
    },
    {
      accessorKey: 'paymentStatus',
      header: t('payment'),
      cell: ({ row }) => <Badge className={PAYMENT_STATUS_COLORS[row.original.paymentStatus]} variant="outline">{tStatus(row.original.paymentStatus)}</Badge>,
    },
    { accessorKey: 'createdAt', header: t('date'), cell: ({ row }) => formatDateTime(row.original.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} searchValue={search} onSearchChange={setSearch} onPageChange={setPage} searchPlaceholder={t('search')} />
    </div>
  );
}
