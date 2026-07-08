'use client';

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
import { cmsApi } from '@/lib/services';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';
import type { Slider } from '@/lib/types';

export default function SlidersPage() {
  const t = useTranslations('sliders');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { data: sliders = [], isLoading } = useQuery({
    queryKey: ['sliders'],
    queryFn: cmsApi.listSliders,
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: cmsApi.deleteSlider,
    queryKey: 'sliders',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
  });

  const columns: ColumnDef<Slider>[] = [
    {
      accessorKey: 'title',
      header: t('slider'),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Image src={row.original.image} alt="" width={80} height={45} className="rounded object-cover" />
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground" dir="rtl">{row.original.titleAr}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'sortOrder', header: tForms('sortOrder') },
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
          <Button variant="ghost" size="icon" asChild><Link href={`/sliders/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => openDelete(row.original.id, row.original.title)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <Button asChild><Link href="/sliders/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable columns={columns} data={sliders} isLoading={isLoading} />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
