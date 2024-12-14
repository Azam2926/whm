import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { SaleStatus } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { Category } from "@/lib/types";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomi" />
    )
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tavsif" />
    )
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
    }
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
  },
];
