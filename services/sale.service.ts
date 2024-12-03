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
          customer_id?: number[] | unknown;
          product_id?: number[] | unknown;
          status?: string[] | unknown;
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

    if (filters?.sorting?.length) {
      sortDirection = filters.sorting[0].desc ? "DESC" : "ASC";
      sortBy = filters?.sorting[0].id;
      if (sortBy === "sale_date") sortBy = "saleDate";
    }

    if (filters?.columnFilters?.length) {
      filters.customer_id = filters.columnFilters.find(
        f => f.id === "customer"
      )?.value;

      filters.product_id = filters.columnFilters.find(
        f => f.id === "product"
      )?.value;

      filters.status = filters.columnFilters.find(
        f => f.id === "status"
      )?.value;
    }

    return api.get<SalesData>("sale", {
      params: {
        customer_ids: filters?.customer_id,
        product_ids: filters?.product_id,
        status: filters?.status,
        pageNumber: filters?.page || 1,
        pageSize: filters?.size || 10,
        sortDirection,
        sortBy
      },
      paramsSerializer: {
        indexes: null // This prevents adding square brackets to array parameters
      }
    });
  },
  create: (data: SaleCreateRequest) =>
    api.post<SaleCreateResponse>("sale", data)
};

export default saleService;
