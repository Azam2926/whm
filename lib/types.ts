import { CustomerStatus } from "./enums";

export interface Category {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  createdAt: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  createdAt: string;
  category?: Category;
}

export interface Customer {
  id: number;
  name: string;
  phone_number?: string;
  address?: string;
  status: CustomerStatus;
}

export interface Sale {
  id: number;
  product_id: number;
  customer_id: number;
  quantity: number;
  price: number;
  sale_date?: string;
  product?: Product;
  customer?: Customer;
}

export interface ProductAnalytics {
  id: number;
  product_id: number;
  total_sales_quantity: number;
  total_sales_amount: number;
  last_sale_date: string;
  product?: Product;
}
