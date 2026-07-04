'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { couponsApi } from '@/lib/services';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Coupon } from '@/lib/types';

export default function CouponsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: couponsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: couponsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast({ title: 'Coupon deleted' });
    },
  });

  const columns: ColumnDef<Coupon>[] = [
    { accessorKey: 'code', header: 'Code', cell: ({ row }) => <span className="font-mono font-medium">{row.original.code}</span> },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'value', header: 'Value', cell: ({ row }) => row.original.type === 'percentage' ? `${row.original.value}%` : `SAR ${row.original.value}` },
    { accessorKey: 'usageCount', header: 'Used', cell: ({ row }) => `${row.original.usageCount}${row.original.usageLimit ? `/${row.original.usageLimit}` : ''}` },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    { accessorKey: 'expiresAt', header: 'Expires', cell: ({ row }) => row.original.expiresAt ? formatDate(row.original.expiresAt) : '—' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/coupons/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Coupons' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <Button asChild><Link href="/coupons/create"><HiOutlinePlus className="h-4 w-4" /> Add Coupon</Link></Button>
      </div>
      <DataTable columns={columns} data={coupons} isLoading={isLoading} />
    </div>
  );
}
