import api from "./http.service";
import { Customer, Product, Sale } from "@/lib/types";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { SaleStatus } from "@/lib/enums";

interface SalesData {
  sales: Sale[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface SaleCreateRequest {
  customer_id: number;
  status: SaleStatus;
  sales: { product_id: number; quantity: number; price: number }[];
}

export interface SaleCreateResponse {
  customer: Customer;
  status: SaleStatus;
  sales: {
    product: Product;
    quantity: number;
    price: number;
    sale_date?: string;
  }[];
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
  create: (data: SaleCreateRequest) =>
    api.post<SaleCreateResponse>("sale", data)
};

export default saleService;
