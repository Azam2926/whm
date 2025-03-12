import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { formatCurrency, formatDate } from "@/utils/utils";
import { Product } from "@/lib/types";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomi" />
    ),
  },
  {
    accessorKey: "measurement",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Birligi" />
    ),
  },
  {
    accessorKey: "type_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Narx turi" />
    ),
  },
  {
    id: "category",
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Toifa" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Narxi" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return formatCurrency(price, row.getValue("type_price"));
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Soni" />
    ),
  },
  {
    id: "total",
    header: "Umumiy narxi:",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      const price = row.getValue("price") as number;
      return formatCurrency(quantity * price, row.getValue("type_price"));
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vaqti" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return formatDate(date as string, "dd MMMM, yyyy");
    },
  },
];
