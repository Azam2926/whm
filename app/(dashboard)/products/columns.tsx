import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { formatDate } from "@/utils/formatDate";
import { Product } from "@/lib/types";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomi" />
    )
  },
  {
    id: "category",
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Toifa" />
    )
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Narxi" />
    )
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Soni" />
    )
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vaqti" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return formatDate(date as string, "dd MMMM, yyyy");
    }
  }
];
