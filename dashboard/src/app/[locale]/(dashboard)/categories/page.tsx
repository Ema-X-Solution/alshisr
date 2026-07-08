'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { categoriesApi } from '@/lib/services';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const t = useTranslations('categories');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: categoriesApi.delete,
    queryKey: 'categories',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
    conflictMessages: {
      'Cannot delete category with associated products': t('deleteHasProducts'),
      'Cannot delete category with subcategories': t('deleteHasSubcategories'),
    },
  });

  const columns: ColumnDef<Category>[] = [
    { accessorKey: 'name', header: t('name') },
    { accessorKey: 'nameAr', header: tForms('nameAr') },
    { accessorKey: 'slug', header: t('slug') },
    { accessorKey: 'productCount', header: tNav('products'), cell: ({ row }) => row.original.productCount ?? 0 },
    {
      accessorKey: 'isActive',
      header: tCommon('status'),
      cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? tCommon('active') : tCommon('inactive')}</Badge>,
    },
    {
      id: 'actions',
      header: tCommon('actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/categories/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDelete(row.original.id, row.original.name)}
          >
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
        <Button asChild><Link href="/categories/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable columns={columns} data={categories} isLoading={isLoading} />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
