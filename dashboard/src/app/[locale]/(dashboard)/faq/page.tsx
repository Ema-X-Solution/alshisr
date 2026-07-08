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
import type { Faq } from '@/lib/types';

export default function FaqPage() {
  const t = useTranslations('faq');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => cmsApi.listFaqs(),
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: cmsApi.deleteFaq,
    queryKey: 'faqs',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
  });

  const columns: ColumnDef<Faq>[] = [
    { accessorKey: 'question', header: t('question'), cell: ({ row }) => <span className="line-clamp-2 max-w-md">{row.original.question}</span> },
    { accessorKey: 'category', header: tForms('category'), cell: ({ row }) => row.original.category || '—' },
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
          <Button variant="ghost" size="icon" asChild><Link href={`/faq/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => openDelete(row.original.id, row.original.question)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <Button asChild><Link href="/faq/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable columns={columns} data={faqs} isLoading={isLoading} searchPlaceholder={t('search')} />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
