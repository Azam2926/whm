"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import {
  DataTableToolbar,
  ToolbarFilterConfig
} from "@/components/ui/data-table-toolbar";

interface ServerSideDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  fetchDataAction: (params: {
    page: number;
    size: number;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
  }) => Promise<{
    rows: TData[];
    totalRows: number;
  }>;
  initialPageSize?: number;
  toolbarConfig?: {
    searchColumn?: string;
    filters?: ToolbarFilterConfig[];
  };
}

export function ServerDataTable<TData, TValue>({
  columns,
  fetchDataAction,
  initialPageSize = 10,
  toolbarConfig = { searchColumn: "", filters: [] }
}: ServerSideDataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch data whenever pagination, sorting, or filters change
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchDataAction({
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sorting,
          columnFilters
        });
        setData(result.rows);
        setTotalRows(result.totalRows);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Optionally handle error state
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pagination, sorting, columnFilters, fetchDataAction]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination
    },
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} config={toolbarConfig} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
