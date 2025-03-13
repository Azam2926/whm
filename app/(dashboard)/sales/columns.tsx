import { ColumnDef } from "@tanstack/react-table";
import { Sale, SaleItem } from "@/lib/types";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { SaleStatus, TypePrice } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SubRow = ({ saleItems }: { saleItems: SaleItem[] }) => {
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
          {saleItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.product?.name ?? ""}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {formatCurrency(item.price, item.product?.type_price)}
              </TableCell>
              <TableCell>
                {formatCurrency(item.total_price, item.product?.type_price)}
                <br />
                {item.product?.type_price === TypePrice.USD && (
                  <span className="text-muted-foreground">
                    Kurs: {item.total_price / (item.quantity * item.price)}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const columns: ColumnDef<Sale>[] = [
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
      return formatDate(date as string, "dd MMMM, yyyy");
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Holati" />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.getValue("status") === SaleStatus.CASH
              ? "default"
              : "destructive"
          }
        >
          {row.getValue("status")}
        </Badge>
      );
    },
  },
  {
    id: "customer",
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mijoz" />
    ),
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
];
