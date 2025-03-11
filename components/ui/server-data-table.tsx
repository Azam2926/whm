"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import {
  DataTableToolbar,
  ToolbarFilterConfig,
} from "@/components/ui/data-table-toolbar";
import { Sale } from "@/lib/types";
import { SubRow } from "@/app/(dashboard)/sales/columns";
import { GeneralSearchParam } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ServerSideDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  fetchDataAction: (params: GeneralSearchParam) => Promise<{
    rows: TData[];
    totalRows: number;
  }>;
  initialPageSize?: number;
  toolbarConfig?: {
    searchColumn?: string;
    filters?: ToolbarFilterConfig[];
  };
  loadingComponent?: React.JSX.Element;
  isRowExpanded?: boolean;
  hasActions?: boolean;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  getClassName?: (row: Row<TData>) => string;
}

export function ServerDataTable<TData, TValue>({
  columns,
  fetchDataAction,
  initialPageSize = 10,
  toolbarConfig = { searchColumn: "", filters: [] },
  loadingComponent,
  isRowExpanded = false,
  hasActions = false,
  onEdit = (row: TData) => console.log("onEdit", row),
  onDelete = (row: TData) => console.log("onDelete", row),
  getClassName = () => "",
}: ServerSideDataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch data whenever pagination, sorting, or filters change
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchDataAction({
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sorting,
          columnFilters,
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
      pagination,
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
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => isRowExpanded,
  });

  return (
    <div className="space-y-4">
      {totalRows !== undefined && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Umumiy soni: {totalRows}</p>
        </div>
      )}
      <DataTableToolbar table={table} config={toolbarConfig} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
                {hasActions && (
                  <TableHead key={"actions"}>Harakatlar</TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              loadingComponent
            ) : data.length ? (
              table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    className={getClassName(row) + " font-medium"}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell key={"actions"}>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(row.original)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(row.original)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                  {row.getIsExpanded() && isRowExpanded && (
                    <TableRow key={-2}>
                      <TableCell colSpan={columns.length}>
                        <SubRow saleItems={(row.original as Sale).sale_items} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow key={-1}>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Ma&#39;lumot topilmadi.
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
