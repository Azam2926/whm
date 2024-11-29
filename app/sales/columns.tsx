import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "@/lib/types";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "sale_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("sale_date");
      return date ? format(new Date(date as string), "MMM d, yyyy") : "-";
    }
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    )
  },
  {
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
