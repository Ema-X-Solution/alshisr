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
import { couponsApi } from '@/lib/services';
import { formatDate } from '@/lib/utils';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';
import type { Coupon } from '@/lib/types';

export default function CouponsPage() {
  const t = useTranslations('coupons');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: couponsApi.list,
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: couponsApi.delete,
    queryKey: 'coupons',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
  });

  const columns: ColumnDef<Coupon>[] = [
    { accessorKey: 'code', header: t('code'), cell: ({ row }) => <span className="font-mono font-medium">{row.original.code}</span> },
    { accessorKey: 'type', header: t('type') },
    { accessorKey: 'value', header: t('value'), cell: ({ row }) => row.original.type === 'percentage' ? `${row.original.value}%` : `SAR ${row.original.value}` },
    { accessorKey: 'usageCount', header: 'Used', cell: ({ row }) => `${row.original.usageCount}${row.original.usageLimit ? `/${row.original.usageLimit}` : ''}` },
    {
      accessorKey: 'isActive',
      header: tCommon('status'),
      cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? tCommon('active') : tCommon('inactive')}</Badge>,
    },
    { accessorKey: 'expiresAt', header: tForms('expiresAt'), cell: ({ row }) => row.original.expiresAt ? formatDate(row.original.expiresAt) : '—' },
    {
      id: 'actions',
      header: tCommon('actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/coupons/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => openDelete(row.original.id, row.original.code)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <Button asChild><Link href="/coupons/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable columns={columns} data={coupons} isLoading={isLoading} />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
