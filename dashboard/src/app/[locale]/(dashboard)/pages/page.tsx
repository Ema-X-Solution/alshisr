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
import { cmsApi } from '@/lib/services';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';
import type { Page } from '@/lib/types';

export default function PagesPage() {
  const t = useTranslations('pages');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: cmsApi.listPages,
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: cmsApi.deletePage,
    queryKey: 'pages',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
  });

  const columns: ColumnDef<Page>[] = [
    { accessorKey: 'title', header: t('page') },
    { accessorKey: 'slug', header: t('slug') },
    {
      accessorKey: 'isPublished',
      header: tCommon('status'),
      cell: ({ row }) => <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>{row.original.isPublished ? tCommon('published') : tCommon('draft')}</Badge>,
    },
    {
      id: 'actions',
      header: tCommon('actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/pages/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
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
        <Button asChild><Link href="/pages/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable columns={columns} data={pages} isLoading={isLoading} searchPlaceholder={t('search')} />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
