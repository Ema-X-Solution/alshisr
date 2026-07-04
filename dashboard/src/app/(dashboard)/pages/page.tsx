'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cmsApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import type { Page } from '@/lib/types';

export default function PagesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: cmsApi.listPages,
  });

  const deleteMutation = useMutation({
    mutationFn: cmsApi.deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast({ title: 'Page deleted' });
    },
  });

  const columns: ColumnDef<Page>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'slug', header: 'Slug' },
    {
      accessorKey: 'isPublished',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>{row.original.isPublished ? 'Published' : 'Draft'}</Badge>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/pages/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Pages' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Button asChild><Link href="/pages/create"><HiOutlinePlus className="h-4 w-4" /> Add Page</Link></Button>
      </div>
      <DataTable columns={columns} data={pages} isLoading={isLoading} />
    </div>
  );
}
