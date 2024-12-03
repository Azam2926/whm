import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "@/lib/types";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { SaleStatus } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "sale_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("sale_date");
      return formatDate(date as string, "dd MMMM, yyyy");
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
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
    }
  },
  {
    id: "customer",
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    )
  },
  {
    id: "product",
    accessorKey: "product.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    )
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    )
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return `$${price.toFixed(2)}`;
    }
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      const price = row.getValue("price") as number;
      return `$${(quantity * price).toFixed(2)}`;
    }
  }
];
