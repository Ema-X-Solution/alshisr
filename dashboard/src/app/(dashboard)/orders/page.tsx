'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ordersApi } from '@/lib/services';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '@/lib/constants';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, search],
    queryFn: () => ordersApi.list({ page, limit: 10, search }),
  });

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Order',
      cell: ({ row }) => (
        <Link href={`/orders/${row.original.id}`} className="font-medium hover:text-primary">
          #{row.original.orderNumber}
        </Link>
      ),
    },
    {
      accessorKey: 'user',
      header: 'Customer',
      cell: ({ row }) => row.original.user ? `${row.original.user.firstName} ${row.original.user.lastName}` : '—',
    },
    { accessorKey: 'total', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total) },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge className={ORDER_STATUS_COLORS[row.original.status]} variant="outline">{row.original.status}</Badge>,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => <Badge className={PAYMENT_STATUS_COLORS[row.original.paymentStatus]} variant="outline">{row.original.paymentStatus}</Badge>,
    },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ row }) => formatDateTime(row.original.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Orders' }]} />
      <h2 className="text-2xl font-bold">Orders</h2>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} searchValue={search} onSearchChange={setSearch} onPageChange={setPage} searchPlaceholder="Search orders..." />
    </div>
  );
}
