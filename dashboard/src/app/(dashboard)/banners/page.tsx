'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cmsApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import type { Banner } from '@/lib/types';

export default function BannersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => cmsApi.listBanners(),
  });

  const deleteMutation = useMutation({
    mutationFn: cmsApi.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({ title: 'Banner deleted' });
    },
  });

  const columns: ColumnDef<Banner>[] = [
    {
      accessorKey: 'title',
      header: 'Banner',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Image src={row.original.image} alt="" width={60} height={36} className="rounded object-cover" />
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    { accessorKey: 'position', header: 'Position' },
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
          <Button variant="ghost" size="icon" asChild><Link href={`/banners/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Banners' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Banners</h2>
        <Button asChild><Link href="/banners/create"><HiOutlinePlus className="h-4 w-4" /> Add Banner</Link></Button>
      </div>
      <DataTable columns={columns} data={banners} isLoading={isLoading} />
    </div>
  );
}
