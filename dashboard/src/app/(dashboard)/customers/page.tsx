'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { usersApi } from '@/lib/services';
import { formatDate } from '@/lib/utils';
import type { User } from '@/lib/types';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => usersApi.list({ page, limit: 10, search, role: 'CUSTOMER' }),
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.firstName} {row.original.lastName}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: 'phone', header: 'Phone', cell: ({ row }) => row.original.phone || '—' },
    { accessorKey: 'ordersCount', header: 'Orders', cell: ({ row }) => row.original.ordersCount ?? 0 },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    { accessorKey: 'createdAt', header: 'Joined', cell: ({ row }) => row.original.createdAt ? formatDate(row.original.createdAt) : '—' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Customers' }]} />
      <h2 className="text-2xl font-bold">Customers</h2>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} searchValue={search} onSearchChange={setSearch} onPageChange={setPage} searchPlaceholder="Search customers..." />
    </div>
  );
}
