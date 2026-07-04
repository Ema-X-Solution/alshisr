'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { brandsApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import type { Brand } from '@/lib/types';

export default function BrandsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: brandsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: brandsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({ title: 'Brand deleted' });
    },
  });

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: 'name',
      header: 'Brand',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.logo && <Image src={row.original.logo} alt="" width={32} height={32} className="rounded" />}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: 'slug', header: 'Slug' },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/brands/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Brands' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Brands</h2>
        <Button asChild><Link href="/brands/create"><HiOutlinePlus className="h-4 w-4" /> Add Brand</Link></Button>
      </div>
      <DataTable columns={columns} data={brands} isLoading={isLoading} />
    </div>
  );
}
