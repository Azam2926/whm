import { Category } from "@/lib/types";
import { columns } from "@/app/(dashboard)/categories/columns";
import { ServerDataTable } from "@/components/ui/server-data-table";
import * as React from "react";
import { useCallback } from "react";
import { api } from "@/lib/services/api";
import { GeneralSearchParam, PAGE_SIZE } from "@/lib/definitions";
import { CategoriesTableSkeleton } from "@/components/categories/categories-table-skeleton";

interface CategoryListProps {
  onEdit: (category: Category) => void,
  onDelete: (id: string) => void,
  filters?: Partial<GeneralSearchParam>,
}

export function CategoryList({ onEdit, onDelete, filters }: CategoryListProps) {
  const fetchDataAction = useCallback(async (params: GeneralSearchParam) => {
    const {
      data: {
        data,
        page: { totalElements }
      }
    } = await api.getCategories({
      ...params,
      ...filters
    });

    return {
      rows: data,
      totalRows: totalElements
    };
  }, []);

  return (
    <>
      <ServerDataTable
        fetchDataAction={fetchDataAction}
        columns={columns}
        initialPageSize={PAGE_SIZE}
        loadingComponent={<CategoriesTableSkeleton />}
        hasActions={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
