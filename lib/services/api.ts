import productsService from "@/services/products.service";
import customerService from "@/services/customer.service";
import saleService, { SaleCreateRequest } from "@/services/sale.service";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import reportService from "@/services/report.service";
import { Report } from "@/lib/types/reports";
import categoryService from "@/services/category.service";
import { GeneralSearchParam } from "@/lib/definitions";

// API service
export const api = {
  // Products
  getProducts: async (params?: Partial<GeneralSearchParam>) =>
    productsService.getAll(params),

  // Customers
  getCustomers: async (params?: Partial<GeneralSearchParam>) =>
    customerService.getAll(params),

  // Categories
  getCategories: async (params?: GeneralSearchParam) =>
    await categoryService.getAll(params),

  // Sales
  getSales: async (
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
      | undefined,
  ) => {
    const response = await saleService.getAll(filters);
    console.log(response);
    return response.data;
  },

  createSale: async (data: SaleCreateRequest) => {
    try {
      await saleService.create(data);
    } catch (error) {
      // Xato yuz berganda, barcha o'zgarishlarni bekor qilish
      console.error("Sotuvni yaratishda xato:", error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async (): Promise<Report> => {
    const [recent_sales, category_wise_total_sales, totals] = await Promise.all(
      [
        reportService.get_recent_sales(),
        reportService.get_category_wise_total_sales(),
        reportService.get_totals(),
      ],
    );
    return {
      recent_sales,
      category_wise_total_sales,
      totals,
    };
  },
};
