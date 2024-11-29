import { Product, ProductAnalytics, SaleCreate } from "../types";
import productsService from "@/services/products.service";
import customerService from "@/services/customer.service";
import saleService from "@/services/sale.service";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

// Simulated API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 500));

const products: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Laptop",
    price: 999.99,
    quantity: 50,
    createdAt: "2024-02-15T10:00:00Z",
    created_at: "2024-02-15T10:00:00Z"
  },
  {
    id: 2,
    category_id: 2,
    name: "Office Chair",
    price: 199.99,
    quantity: 30,
    createdAt: "2024-02-15T10:00:00Z",
    created_at: "2024-02-15T10:00:00Z"
  }
];
const analytics: ProductAnalytics[] = [
  {
    id: 1,
    product_id: 1,
    total_sales_quantity: 10,
    total_sales_amount: 9999.9,
    last_sale_date: "2024-02-15T10:00:00Z"
  },
  {
    id: 2,
    product_id: 2,
    total_sales_quantity: 5,
    total_sales_amount: 999.95,
    last_sale_date: "2024-02-15T10:00:00Z"
  }
];

// API service
export const api = {
  // Products
  getProducts: async () => productsService.getAll(),

  // Customers
  getCustomers: async () => customerService.getAll(),

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
      | undefined
  ) => await saleService.getAll(filters),

  createSale: async (data: SaleCreate) => {
    try {
      await saleService.create(data);
    } catch (error) {
      // Xato yuz berganda, barcha o'zgarishlarni bekor qilish
      console.error("Sotuvni yaratishda xato:", error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async () => {
    await delay();
    return analytics.map(analytic => ({
      ...analytic,
      product: products.find(p => p.id === analytic.product_id)
    }));
  }
};
