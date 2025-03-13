import { ColumnDef } from "@tanstack/react-table";
import { Sale, SaleItem } from "@/lib/types";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { SaleStatus, TypePrice } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatNumber } from "@/utils/utils";
import { ChevronDown, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
import { memo } from "react";

// Memoized SubRow component to prevent unnecessary re-renders
export const SubRow = memo(({ saleItems }: { saleItems: SaleItem[] }) => {
  return (
    <div className="p-4 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mahsulot</TableHead>
            <TableHead>Miqdori</TableHead>
            <TableHead>Narxi</TableHead>
            <TableHead>Jami</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saleItems.map(item => (
            <TableRow
              key={item.id || `item-${item.product.id}-${item.created_at}`}
            >
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {formatCurrency(item.product.price, item.product.type_price)}
              </TableCell>
              <TableCell>
                {formatCurrency(item.total_price)}
                {item.product.type_price === TypePrice.USD && (
                  <div className="text-muted-foreground text-sm mt-1">
                    Kurs:{" "}
                    {formatNumber(
                      item.total_price / (item.quantity * item.product.price),
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
SubRow.displayName = "SubRow";

// Helper for status badge - extracted for readability
const StatusBadge = ({ status }: { status: SaleStatus }) => {
  return (
    <Badge variant={status === SaleStatus.CASH ? "default" : "destructive"}>
      {status}
    </Badge>
  );
};

// Type for the column configuration
interface ColumnOptions {
  onPrint: (sale: Sale) => void;
}

// Column definitions
export const columns = ({ onPrint }: ColumnOptions): ColumnDef<Sale>[] => [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-8 w-8"
          onClick={() => row.toggleExpanded()}
          aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "sale_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vaqti" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("sale_date");
      if (!date) return "-";
      return formatDate(date as string, "dd MMMM, yyyy");
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Holati" />
    ),
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "customer",
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mijoz" />
    ),
    cell: ({ row }) => {
      const customerName = row.getValue("customer");
      return customerName || "-";
    },
  },
  {
    accessorKey: "total_sum",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Umumiy summa" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("total_sum") as number;
      return formatCurrency(total);
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-10"
        column={column}
        title="Harakatlar"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              onPrint(row.original);
            }}
            aria-label="Print sale receipt"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
