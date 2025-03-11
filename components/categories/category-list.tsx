import { Category } from "@/lib/types";
import { columns } from "@/app/(dashboard)/categories/columns";
import { ServerDataTable } from "@/components/ui/server-data-table";
import * as React from "react";
import { useCallback } from "react";
import { api } from "@/lib/services/api";
import { GeneralSearchParam, PAGE_SIZE } from "@/lib/definitions";
import CategoriesTableSkeleton from "@/components/categories/categories-table-skeleton";
import { RootStatus } from "@/lib/enums";
import { ShieldBan, ShieldCheck } from "lucide-react";

interface CategoryListProps {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryList({ onEdit, onDelete }: CategoryListProps) {
  const fetchDataAction = useCallback(async (params: GeneralSearchParam) => {
    const {
      data: {
        data,
        page: { totalElements },
      },
    } = await api.getCategories(params);

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
      loadingComponent={<CategoriesTableSkeleton />}
      hasActions={true}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
