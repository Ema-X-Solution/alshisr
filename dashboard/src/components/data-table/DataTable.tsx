'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineSelector } from 'react-icons/hi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/lib/types';

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  toolbar?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  meta,
  isLoading,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  onPageChange,
  toolbar,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {onSearchChange && (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        )}
        {toolbar}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted/50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            className={cn(
                              'flex items-center gap-1',
                              header.column.getCanSort() && 'cursor-pointer select-none',
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <>
                                {header.column.getIsSorted() === 'asc' ? (
                                  <HiOutlineChevronUp className="h-4 w-4" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <HiOutlineChevronDown className="h-4 w-4" />
                                ) : (
                                  <HiOutlineSelector className="h-4 w-4 opacity-50" />
                                )}
                              </>
                            )}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="h-32 text-center">
                      <LoadingSpinner className="mx-auto" />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                      No results found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1} to{' '}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasPrevPage}
              onClick={() => onPageChange?.(meta.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasNextPage}
              onClick={() => onPageChange?.(meta.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
