'use client';

import { RowActions } from './row-actions';
import { ColumnDef } from '@tanstack/react-table';
import type { WorkspaceCrawler } from '@tutur3u/types/db';
import { DataTableColumnHeader } from '@tutur3u/ui/custom/tables/data-table-column-header';
import moment from 'moment';
import Link from 'next/link';

export const getColumns = (
  t: any,
  namespace: string | undefined,
  _?: any,
  extraData?: any
): ColumnDef<WorkspaceCrawler>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        t={t}
        column={column}
        title={t(`${namespace}.id`)}
      />
    ),
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[8rem]">{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader
        t={t}
        column={column}
        title={t(`${namespace}.url`)}
      />
    ),
    cell: ({ row }) => (
      <Link
        href={row.getValue('href') || '#'}
        className="min-w-[4rem]"
        rel="noreferrer"
      >
        <span className="line-clamp-1 font-semibold hover:underline">
          {row.getValue('url') || '-'}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        t={t}
        column={column}
        title={t(`${namespace}.created_at`)}
      />
    ),
    cell: ({ row }) => (
      <div className="min-w-[8rem]">
        {moment(row.getValue('created_at')).format('DD/MM/YYYY')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <RowActions row={row} href={row.original.href} extraData={extraData} />
    ),
  },
];
