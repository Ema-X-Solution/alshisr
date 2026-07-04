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
import type { Slider } from '@/lib/types';

export default function SlidersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sliders = [], isLoading } = useQuery({
    queryKey: ['sliders'],
    queryFn: cmsApi.listSliders,
  });

  const deleteMutation = useMutation({
    mutationFn: cmsApi.deleteSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sliders'] });
      toast({ title: 'Slider deleted' });
    },
  });

  const columns: ColumnDef<Slider>[] = [
    {
      accessorKey: 'title',
      header: 'Slider',
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
          <Button variant="ghost" size="icon" asChild><Link href={`/sliders/${row.original.id}/edit`}><HiOutlinePencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.original.id)}><HiOutlineTrash className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Sliders' }]} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sliders</h2>
        <Button asChild><Link href="/sliders/create"><HiOutlinePlus className="h-4 w-4" /> Add Slider</Link></Button>
      </div>
      <DataTable columns={columns} data={sliders} isLoading={isLoading} />
    </div>
  );
}
