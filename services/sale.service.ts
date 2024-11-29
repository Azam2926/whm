import api from "./http.service";
import { Sale } from "@/lib/types";
import { SortingState } from "@tanstack/react-table";

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
      | {
          customer_id?: number;
          product_id?: number;
          start_date?: string;
          end_date?: string;
          page?: number;
          size?: number;
          sorting?: SortingState;
        }
      | undefined
  ) => {
    let sortDirection = "DESC";
    let sortBy = "id";

    if (filters?.sorting && filters?.sorting[0]) {
      sortDirection = filters.sorting[0].desc ? "DESC" : "ASC";
      sortBy = filters?.sorting[0].id;
      if (sortBy === "sale_date") sortBy = "saleDate";
    }
    return api.get<SalesData>("sale", {
      params: {
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
