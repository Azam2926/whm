"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaleDialog } from "@/components/sales/sale-dialog";
import { api } from "@/lib/services/api";
import { Customer, Product } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { columns } from "@/app/sales/columns";
import { ServerDataTable } from "@/components/ui/server-data-table";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import * as React from "react";

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const PAGE_SIZE = 10;

  const fetchDataAction = async (params: {
    page: number;
    size: number;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
  }) => {
    console.log(params);
    const {
      data: {
        sales,
        page: { totalElements }
      }
    } = await api.getSales(params);

    return {
      rows: sales,
      totalRows: totalElements
    };
  };
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [
        {
          data: { data: productsData }
        },
        {
          data: { data: customersData }
        }
      ] = await Promise.all([api.getProducts(), api.getCustomers()]);
      setProducts(productsData);
      setCustomers(customersData);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (saleData: {
    customerId: number;
    sales: { productId: number; quantity: number; price: number }[];
  }) => {
    await api.createSale(saleData);
    await loadData();
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sales</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Sale
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        //         interface FilterOption {
        //   label: string;
        //   value: string;
        //   icon?: React.ComponentType;
        // }
        //
        // export interface ToolbarFilterConfig {
        //   columnName: string;
        //   type: "input" | "select" | "faceted";
        //   placeholder?: string;
        //   options?: FilterOption[];
        // }
        <ServerDataTable
          fetchDataAction={fetchDataAction}
          columns={columns}
          initialPageSize={PAGE_SIZE}
          toolbarConfig={{
            searchColumn: "",
            filters: [
              {
                columnName: "product",
                type: "faceted",
                placeholder: "Product",
                options: products.map(p => ({
                  label: p.name,
                  value: p.id.toString()
                }))
              },
              {
                columnName: "customer",
                type: "faceted",
                placeholder: "Customer",
                options: customers.map(c => ({
                  label: c.name,
                  value: c.id.toString()
                }))
              }
            ]
          }}
        />
      )}

      <SaleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreate}
        products={products}
        customers={customers}
      />
    </div>
  );
}
