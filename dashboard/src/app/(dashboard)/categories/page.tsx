'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { categoriesApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category deleted' });
    },
    onError: () => toast({ title: 'Failed to delete category', variant: 'destructive' }),
  });

  const columns: ColumnDef<Category>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'nameAr', header: 'Name (AR)' },
    { accessorKey: 'slug', header: 'Slug' },
    { accessorKey: 'productCount', header: 'Products', cell: ({ row }) => row.original.productCount ?? 0 },
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
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/categories/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link>
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
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Categories' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button asChild><Link href="/categories/create"><HiOutlinePlus className="h-4 w-4" /> Add Category</Link></Button>
      </div>
      <DataTable columns={columns} data={categories} isLoading={isLoading} />
    </div>
  );
}
