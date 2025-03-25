"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Coins, CreditCard, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaleDialog } from "@/components/sales/sale-dialog";
import { api } from "@/lib/services/api";
import type { Customer, Product, Sale } from "@/lib/types";
import { columns } from "@/app/(dashboard)/sales/columns";
import { ServerDataTable } from "@/components/ui/server-data-table";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import type { SaleCreateRequest } from "@/services/sale.service";
import { SaleStatus } from "@/lib/enums";
import { SalesTableSkeleton } from "@/components/sales/sales-table-skeleton";
import { pdfService } from "@/lib/services/pdf-service";
import { PdfViewer } from "@/components/pdf/pdf-viewer";

const PAGE_SIZE = 10;

export default function SalesPage() {
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Memoized filter options for better performance
  const statusFilterOptions = useMemo(
    () => [
      {
        label: SaleStatus.CASH,
        value: SaleStatus.CASH,
        icon: Coins,
      },
      {
        label: SaleStatus.CREDIT,
        value: SaleStatus.CREDIT,
        icon: CreditCard,
      },
    ],
    [],
  );

  // Data fetching for the table
  const fetchDataAction = useCallback(
    async (params: {
      page: number;
      size: number;
      sorting?: SortingState;
      columnFilters?: ColumnFiltersState;
    }) => {
      try {
        const {
          data,
          page: { totalElements },
        } = await api.getSales(params);

        return {
          rows: data,
          totalRows: totalElements,
        };
      } catch (error) {
        console.log(error, "Failed to fetch sales data");
        return { rows: [], totalRows: 0 };
      }
    },
    [],
  );

  // Load reference data (products and customers)
  const loadReferenceData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        {
          data: { data: productsData },
        },
        {
          data: { data: customersData },
        },
      ] = await Promise.all([
        api.getProducts({ size: 1000 }),
        api.getCustomers({ size: 1000 }),
      ]);

      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.log(error, "Failed to load reference data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  // Handlers
  const handleCreate = async (saleData: SaleCreateRequest) => {
    try {
      await api.createSale(saleData);
      await loadReferenceData();
      setIsDialogOpen(false);
      handleRefresh();
    } catch (error) {
      console.log(error, "Failed to create sale");
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handlePrint = useCallback((sale: Sale) => {
    try {
      setSelectedSale(sale);
      const pdfDataUrl = pdfService.generateSalePdf(sale);
      setPdfUrl(pdfDataUrl);
      setIsPdfViewerOpen(true);
    } catch (error) {
      console.log(error, "Error generating PDF");
    }
  }, []);

  // Memoize customer filter options for better performance
  const customerFilterOptions = useMemo(
    () =>
      customers.map(c => ({
        label: c.name,
        value: c.id.toString(),
      })),
    [customers],
  );

  // Memoize table columns to prevent unnecessary re-renders
  const tableColumns = useMemo(
    () => columns({ onPrint: handlePrint }),
    [handlePrint],
  );

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
          <Button onClick={() => setIsDialogOpen(!isDialogOpen)}>
            <Plus className="mr-2 h-4 w-4" /> Sotuv qo&#39;shish
          </Button>
        </div>
      </div>

      <SaleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreate}
        products={products}
        customers={customers}
      />

      <ServerDataTable
        key={refreshKey}
        fetchDataAction={fetchDataAction}
        columns={tableColumns}
        initialPageSize={PAGE_SIZE}
        toolbarConfig={{
          searchColumn: "",
          filters: [
            {
              columnName: "customer",
              type: "faceted",
              placeholder: "Mijoz",
              options: customerFilterOptions,
            },
            {
              columnName: "status",
              type: "faceted",
              placeholder: "Holat",
              options: statusFilterOptions,
            },
          ],
        }}
        loadingComponent={<SalesTableSkeleton />}
        isRowExpanded={true}
      />

      {isPdfViewerOpen && (
        <PdfViewer
          doc={pdfService.getDoc()}
          pdfUrl={pdfUrl}
          fileName={`sale-${selectedSale?.sale_id || "unknown"}.pdf`}
          open={isPdfViewerOpen}
          onOpenChange={setIsPdfViewerOpen}
        />
      )}
    </div>
  );
}
