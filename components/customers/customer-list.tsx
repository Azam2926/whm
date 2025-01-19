import { ShieldBan, ShieldCheck } from "lucide-react";
import { Customer } from "@/lib/types";
import { RootStatus } from "@/lib/enums";
import * as React from "react";
import { useCallback } from "react";
import { GeneralSearchParam, PAGE_SIZE } from "@/lib/definitions";
import { api } from "@/lib/services/api";
import { columns } from "@/app/(dashboard)/customers/columns";
import { ServerDataTable } from "@/components/ui/server-data-table";
import CustomersTableSkeleton from "@/components/customers/customers-table-skeleton";

interface CustomerListProps {
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerList({ onEdit, onDelete }: CustomerListProps) {
  const fetchDataAction = useCallback(async (params: GeneralSearchParam) => {
    const {
      data: {
        data,
        page: { totalElements },
      },
    } = await api.getCustomers(params);

    return {
      rows: data,
      totalRows: totalElements,
    };
  }, []);

  return (
    <ServerDataTable
      fetchDataAction={fetchDataAction}
      columns={columns}
      initialPageSize={PAGE_SIZE}
      toolbarConfig={{
        searchColumn: "name",
        filters: [
          {
            columnName: "status",
            type: "faceted",
            placeholder: "Holat",
            options: [
              {
                label: RootStatus.ACTIVE,
                value: RootStatus.ACTIVE,
                icon: ShieldCheck,
              },
              {
                label: RootStatus.INACTIVE,
                value: RootStatus.INACTIVE,
                icon: ShieldBan,
              },
            ],
          },
        ],
      }}
      loadingComponent={<CustomersTableSkeleton />}
      hasActions={true}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
