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
      <DataTableColumnHeader column={column} title="Vaqti" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("sale_date");
      return formatDate(date as string, "dd MMMM, yyyy");
    }
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
    id: "customer",
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mijoz" />
    )
  },
  {
    id: "product",
    accessorKey: "product.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mahsulot" />
    )
  },
  {
    accessorKey: "total_sum",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Umumiy summa" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("total_sum") as number;
      const formatter = new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      return formatter.format(total);
    }
  }
];
