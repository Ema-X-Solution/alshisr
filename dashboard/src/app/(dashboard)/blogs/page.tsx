'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cmsApi } from '@/lib/services';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Blog } from '@/lib/types';

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => cmsApi.listBlogs({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: cmsApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast({ title: 'Blog deleted' });
    },
  });

  const columns: ColumnDef<Blog>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'author', header: 'Author', cell: ({ row }) => row.original.author || '—' },
    {
      accessorKey: 'isPublished',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>{row.original.isPublished ? 'Published' : 'Draft'}</Badge>,
    },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => row.original.createdAt ? formatDate(row.original.createdAt) : '—' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/blogs/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Blogs' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <Button asChild><Link href="/blogs/create"><HiOutlinePlus className="h-4 w-4" /> Add Blog</Link></Button>
      </div>
      <DataTable columns={columns} data={data?.data || []} meta={data?.meta} isLoading={isLoading} onPageChange={setPage} />
    </div>
  );
}
