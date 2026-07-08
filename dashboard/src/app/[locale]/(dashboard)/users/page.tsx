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
import { usersApi } from '@/lib/services';
import { ROLE_COLORS } from '@/lib/constants';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';
import type { User } from '@/lib/types';

export default function UsersPage() {
  const t = useTranslations('users');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('status');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => usersApi.list({ page, limit: 10, search }),
  });

  const { deleteDialogProps, openDelete } = useDeleteConfirm({
    deleteFn: usersApi.delete,
    queryKey: 'users',
    successMessage: t('deleted'),
    fallbackErrorMessage: t('deleteFailed'),
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.firstName} {row.original.lastName}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: t('role'),
      cell: ({ row }) => <Badge className={ROLE_COLORS[row.original.role]} variant="outline">{tStatus(row.original.role)}</Badge>,
    },
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
          <Button variant="ghost" size="icon" asChild><Link href={`/users/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDelete(row.original.id, `${row.original.firstName} ${row.original.lastName}`)}
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
        <Button asChild><Link href="/users/create"><HiOutlinePlus className="h-4 w-4" /> {t('add')}</Link></Button>
      </div>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} searchValue={search} onSearchChange={setSearch} onPageChange={setPage} searchPlaceholder={t('search')} />
      <DeleteConfirmDialog {...deleteDialogProps} />
    </div>
  );
}
