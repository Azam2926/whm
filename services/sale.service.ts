import api from "./http.service";
import { Sale } from "@/lib/types";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

interface SalesData {
  sales: Sale[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const saleService = {
  getAll: async (
    filters?:
      | Partial<{
          customer_id?: number;
          product_id?: number;
          start_date?: string;
          end_date?: string;
          page?: number;
          size?: number;
          sorting?: SortingState;
          columnFilters: ColumnFiltersState;
        }>
      | undefined
  ) => {
    let sortDirection = "DESC";
    let sortBy = "id";

    if (filters?.sorting && filters?.sorting[0]) {
      sortDirection = filters.sorting[0].desc ? "DESC" : "ASC";
      sortBy = filters?.sorting[0].id;
      if (sortBy === "sale_date") sortBy = "saleDate";
    }

    if (filters?.columnFilters && filters?.columnFilters.length) {
      const customer = filters.columnFilters.find(f => f.id === "customer");
      if (customer)
        filters.customer_id = parseInt((customer.value as Array<string>)[0]);

      const product = filters.columnFilters.find(f => f.id === "product");
      if (product)
        filters.product_id = parseInt((product.value as Array<string>)[0]);
    }

    return api.get<SalesData>("sale", {
      params: {
        customerId: filters?.customer_id,
        productId: filters?.product_id,
        pageNumber: filters?.page || 1,
        pageSize: filters?.size || 10,
        sortDirection,
        sortBy
      }
    });
  },
  create: (data: unknown) => api.post("sale", data)
};

export default saleService;
