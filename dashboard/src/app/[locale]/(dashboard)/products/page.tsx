'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { productsApi } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const t = useTranslations('products');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => productsApi.list({ page, limit: 10, search }),
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: productsApi.delete,
    queryKey: 'products',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: t('product'),
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
    { accessorKey: 'price', header: t('price'), cell: ({ row }) => formatCurrency(row.original.price) },
    { accessorKey: 'stock', header: t('stock') },
    {
      accessorKey: 'isActive',
      header: tCommon('status'),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? tCommon('active') : tCommon('inactive')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: tCommon('actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/products/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openDelete(row.original.id, row.original.name)}>
            <HiOutlineTrash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <Button asChild><Link href="/products/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.data || []}
        meta={data?.meta}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        searchPlaceholder={t('search')}
      />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
