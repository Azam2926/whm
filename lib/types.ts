import { RootStatus, SaleStatus } from "./enums";

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
}

export interface Customer {
  id: number;
  name: string;
  phone_number?: string;
  address?: string;
  status: RootStatus;
  created_at: string;
}

curl -X 'POST' \
  'https://warehouse-app-l6ug.onrender.com/auth/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
"email": "warehouse@gmail.com",
  "password": "warehouse12345"
}'

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
