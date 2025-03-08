import { Measurement, RootStatus, SaleStatus, TypePrice } from "./enums";

export interface Category {
  id: number;
  name: string;
  description: string;
  status: RootStatus;
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  category?: Category;
  measurement?: Measurement;
  type_price?: TypePrice;
}

export interface Customer {
  id: number;
  name: string;
  phone_number?: string;
  address?: string;
  status: RootStatus;
  created_at: string;
}

export interface Sale {
  id: number;
  customer?: Customer;
  sale_items: SaleItem[];
  sale_date?: string;
  total_sum: number;
  status: SaleStatus;
}

export interface SaleItem {
  id?: number;
  product?: Product;
  quantity: number;
  price: number;
  total_price: number;
  created_at: string;
}

export interface ProductAnalytics {
  id: number;
  product_id: number;
  total_sales_quantity: number;
  total_sales_amount: number;
  last_sale_date: string;
  product?: Product;
}
