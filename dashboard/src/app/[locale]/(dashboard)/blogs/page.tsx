'use client';

import { useState } from 'react';
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
import { formatDate } from '@/lib/utils';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';
import type { Blog } from '@/lib/types';

export default function BlogsPage() {
  const t = useTranslations('blogs');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tContact = useTranslations('contact');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => cmsApi.listBlogs({ page, limit: 10 }),
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: cmsApi.deleteBlog,
    queryKey: 'blogs',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
  });

  const columns: ColumnDef<Blog>[] = [
    { accessorKey: 'title', header: t('blog') },
    { accessorKey: 'author', header: 'Author', cell: ({ row }) => row.original.author || '—' },
    {
      accessorKey: 'isPublished',
      header: tCommon('status'),
      cell: ({ row }) => <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>{row.original.isPublished ? tCommon('published') : tCommon('draft')}</Badge>,
    },
    { accessorKey: 'createdAt', header: tContact('date'), cell: ({ row }) => row.original.createdAt ? formatDate(row.original.createdAt) : '—' },
    {
      id: 'actions',
      header: tCommon('actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/blogs/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
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
        <Button asChild><Link href="/blogs/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} onPageChange={setPage} searchPlaceholder={t('search')} />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
