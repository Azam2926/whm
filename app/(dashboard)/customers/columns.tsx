import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { RootStatus } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/lib/types";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomi" />
    ),
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tel. nomer" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Manzil" />
    ),
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
            row.getValue("status") === RootStatus.ACTIVE
              ? "default"
              : "destructive"
          }
        >
          {row.getValue("status")}
        </Badge>
      );
    },
  },
];
