/**
 * Table Widget
 *
 * Displays tabular data with sorting, filtering, and export capabilities.
 * Like a table component in Figma - structured data presentation.
 */

'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetProps } from '../types';

type TableWidgetConfig = WidgetProps<{
  type: 'table';
  data: {
    columns: Array<{
      key: string;
      label: string;
      type: 'text' | 'number' | 'currency' | 'percentage' | 'badge' | 'date';
      sortable?: boolean;
      width?: string;
    }>;
    rows: Record<string, any>[];
    sortable?: boolean;
    filterable?: boolean;
    exportable?: boolean;
    pageSize?: number;
  };
}>;

export default function TableWidget({ config, onAction }: TableWidgetConfig) {
  const { columns, rows, sortable = true, exportable = true, pageSize = 10 } = config.data;
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(0);

  // Format cell value based on type
  const formatCellValue = (value: any, type: string): string => {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'currency':
        if (typeof value === 'number') {
          return value >= 1000000 ? `$${(value / 1000000).toFixed(2)}M` : `$${(value / 1000).toFixed(0)}K`;
        }
        return value;
      case 'percentage':
        return typeof value === 'number' ? `${value}%` : value;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return String(value);
    }
  };

  // Sort and filter rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal || '');
      const bStr = String(bVal || '');

      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [rows, sortColumn, sortDirection]);

  // Pagination
  const paginatedRows = useMemo(() => {
    const start = currentPage * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedRows.length / pageSize);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const column = columns.find(c => c.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    onAction?.('export', { data: sortedRows });
  };

  return (
    <div className="space-y-3">
      {/* Table Header with Export */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {sortedRows.length} {sortedRows.length === 1 ? 'row' : 'rows'}
        </span>
        {exportable && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap',
                    column.sortable && sortable && 'cursor-pointer hover:bg-muted/50 transition-colors',
                    column.width && `w-[${column.width}]`
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortable && (
                      <span className="text-muted-foreground">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedRows.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-muted/30 transition-colors"
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-foreground',
                        column.type === 'number' && 'text-right',
                        column.type === 'currency' && 'text-right font-medium',
                        column.type === 'badge' && 'text-center'
                      )}
                    >
                      {column.type === 'badge' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {value}
                        </span>
                      ) : (
                        formatCellValue(value, column.type)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
