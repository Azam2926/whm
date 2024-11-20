export interface Category {
  id: number;
  name: string;
  description: string;
  status: string;
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
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  status: string;
}

export interface Sale {
  id: number;
  product_id: number;
  customer_id: number;
  quantity: number;
  price: number;
  sale_date: string;
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