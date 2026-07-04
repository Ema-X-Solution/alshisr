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
import type { Faq } from '@/lib/types';

export default function FaqPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => cmsApi.listFaqs(),
  });

  const deleteMutation = useMutation({
    mutationFn: cmsApi.deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast({ title: 'FAQ deleted' });
    },
  });

  const columns: ColumnDef<Faq>[] = [
    { accessorKey: 'question', header: 'Question', cell: ({ row }) => <span className="line-clamp-2 max-w-md">{row.original.question}</span> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => row.original.category || '—' },
    { accessorKey: 'sortOrder', header: 'Order' },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => <Badge variant={row.original.isActive ? 'default' : 'secondary'}>{row.original.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/faq/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'FAQ' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <Button asChild><Link href="/faq/create"><HiOutlinePlus className="h-4 w-4" /> Add FAQ</Link></Button>
      </div>
      <DataTable columns={columns} data={faqs} isLoading={isLoading} />
    </div>
  );
}
