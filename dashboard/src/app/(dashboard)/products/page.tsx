'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { productsApi } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => productsApi.list({ page, limit: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted' });
    },
    onError: () => toast({ title: 'Failed to delete product', variant: 'destructive' }),
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.images?.[0]?.url && (
            <Image src={row.original.images[0].url} alt="" width={40} height={40} className="rounded object-cover" />
          )}
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.sku}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatCurrency(row.original.price) },
    { accessorKey: 'stock', header: 'Stock' },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/products/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}>
            <HiOutlineTrash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Products' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button asChild><Link href="/products/create"><HiOutlinePlus className="h-4 w-4" /> Add Product</Link></Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.data || []}
        meta={data?.meta}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        searchPlaceholder="Search products..."
      />
    </div>
  );
}
