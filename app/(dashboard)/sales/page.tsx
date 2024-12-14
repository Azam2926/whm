"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Coins, CreditCard, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaleDialog } from "@/components/sales/sale-dialog";
import { api } from "@/lib/services/api";
import { Customer, Product } from "@/lib/types";
import { columns } from "@/app/(dashboard)/sales/columns";
import { ServerDataTable } from "@/components/ui/server-data-table";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { SaleCreateRequest } from "@/services/sale.service";
import { SaleStatus } from "@/lib/enums";
import { SalesTableSkeleton } from "@/components/sales/sales-table-skeleton";

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const PAGE_SIZE = 10;

  const fetchDataAction = useCallback(
    async (params: {
      page: number;
      size: number;
      sorting?: SortingState;
      columnFilters?: ColumnFiltersState;
    }) => {
      const {
        data,
        page: { totalElements }
      } = await api.getSales(params);

      return {
        rows: data,
        totalRows: totalElements
      };
    },
    []
  );
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

      return {
        products: productsData,
        customers: customersData
      };
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData().then(data => {
      setProducts(data.products);
      setCustomers(data.customers);
    });
  }, []);

  const handleCreate = async (saleData: SaleCreateRequest) => {
    await api.createSale(saleData);
    await loadData();
    setIsDialogOpen(false);
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sotuvlar</h1>
          <p className="text-gray-500 mt-1">Barcha sotuvlar ro&#39;yxati</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Yangilash
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Sotuv qo&#39;shish
          </Button>
        </div>
      </div>

      <ServerDataTable
        key={refreshKey}
        fetchDataAction={fetchDataAction}
        columns={columns}
        initialPageSize={PAGE_SIZE}
        toolbarConfig={{
          searchColumn: "",
          filters: [
            {
              columnName: "customer",
              type: "faceted",
              placeholder: "Mijoz",
              options: customers.map(c => ({
                label: c.name,
                value: c.id.toString()
              }))
            },
            {
              columnName: "status",
              type: "faceted",
              placeholder: "Holat",
              options: [
                {
                  label: SaleStatus.CASH,
                  value: SaleStatus.CASH,
                  icon: Coins
                },
                {
                  label: SaleStatus.CREDIT,
                  value: SaleStatus.CREDIT,
                  icon: CreditCard
                }
              ]
            }
          ]
        }}
        loadingComponent={<SalesTableSkeleton />}
        isRowExpanded={true}
      />

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
