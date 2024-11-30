"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType;
}

export interface ToolbarFilterConfig {
  columnName: string;
  type: "input" | "select" | "faceted";
  placeholder?: string;
  options?: FilterOption[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  config: {
    searchColumn?: string;
    filters?: ToolbarFilterConfig[];
  };
}

export function DataTableToolbar<TData>({
  table,
  config
}: DataTableToolbarProps<TData>) {
  const { searchColumn, filters } = config;
  const isFiltered = table.getState().columnFilters.length > 0;

  // Dynamic search input handler
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (searchColumn) {
      const column = table.getColumn(searchColumn);
      column?.setFilterValue(event.target.value);
    }
  };

  // Get search input value
  const getSearchInputValue = () => {
    if (searchColumn) {
      const column = table.getColumn(searchColumn);
      return (column?.getFilterValue() as string) ?? "";
    }
    return "";
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchColumn && (
          <Input
            placeholder={`Filter ${searchColumn}...`}
            value={getSearchInputValue()}
            onChange={handleSearchInputChange}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Dynamic Filters */}
        {filters?.map(filterConfig => {
          const column = table.getColumn(filterConfig.columnName);

          if (!column) return null;

          // Faceted filter for select/multi-select columns
          if (filterConfig.type === "faceted" && filterConfig.options) {
            return (
              <DataTableFacetedFilter
                key={filterConfig.columnName}
                column={column}
                title={filterConfig.placeholder}
                options={filterConfig.options}
              />
            );
          }

          return null;
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
