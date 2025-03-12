"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/products/product-dialog";
import { Category, Product } from "@/lib/types";
import productsService from "@/services/products.service";
import categoryService from "@/services/category.service";
import { columns } from "@/app/(dashboard)/products/columns";
import { GeneralSearchParam, PAGE_SIZE } from "@/lib/definitions";
import ProductsTableSkeleton from "@/components/products/products-table-skeleton";
import { ServerDataTable } from "@/components/ui/server-data-table";
import { api } from "@/lib/services/api";
import { Row } from "@tanstack/react-table";

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const updateRefreshKey = () => setRefreshKey(refreshKey + 1);

  const loadData = async () => {
    const {
      data: { data },
    } = await categoryService.getAll({ size: 100 });
    setCategories(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (
    product: Omit<Product, "id" | "created_at" | "category">,
  ) => {
    await productsService.create(product);
    updateRefreshKey();
    setIsDialogOpen(false);
  };

  const handleUpdate = async (id: number, product: Partial<Product>) => {
    await productsService.update(id, product);
    updateRefreshKey();
    setSelectedProducts(null);
  };

  const handleDelete = async (product: Product) => {
    await productsService.delete(product.id.toString());
    updateRefreshKey();
  };
  const fetchDataAction = useCallback(async (params: GeneralSearchParam) => {
    const {
      data: {
        data,
        page: { totalElements },
      },
    } = await api.getProducts(params);

    return {
      rows: data,
      totalRows: totalElements,
    };
  }, []);

  const getClassName = (row: Row<Product>): string => {
    const count = row.original.quantity;
    return count <= 10
      ? "bg-red-200! dark:text-gray-900"
      : count < 20
        ? "bg-amber-200! dark:text-gray-900"
        : "";
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mahsulotlar</h1>
          <div className="flex space-x-2 text-xs dark:text-gray-900">
            <p className="rounded-sm p-1 bg-red-200">10 tadan kam</p>
            <p className="rounded-sm p-1 bg-amber-200">20 tadan kam</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setIsDialogOpen(true);
            setSelectedProducts(null);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Mahsulot qo&#39;shish
        </Button>
      </div>

      <ServerDataTable
        key={refreshKey}
        fetchDataAction={fetchDataAction}
        columns={columns}
        getClassName={getClassName}
        initialPageSize={PAGE_SIZE}
        toolbarConfig={{
          searchColumn: "name",
          filters: [
            {
              columnName: "category",
              type: "faceted",
              placeholder: "Toifa",
              options: categories.map(c => ({
                label: c.name,
                value: c.id.toString(),
              })),
            },
          ],
        }}
        loadingComponent={<ProductsTableSkeleton />}
        hasActions={true}
        onEdit={setSelectedProducts}
        onDelete={handleDelete}
      />

      <ProductDialog
        open={isDialogOpen || !!selectedProducts}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) setSelectedProducts(null);
        }}
        product={selectedProducts}
        categories={categories}
        onSubmit={
          selectedProducts
            ? data => handleUpdate(selectedProducts.id, data)
            : handleCreate
        }
      />
    </div>
  );
}
