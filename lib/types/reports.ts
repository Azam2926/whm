export interface Report {
  recent_sales: ReportRecentSales[];
  category_wise_total_sales: ReportCategoryWiseSales[];
}

export interface ReportRecentSales {
  customer_name: string;
  product_name: string;
  total_price: number;
  sale_date: string;
}

export interface ReportCategoryWiseSales {
  category_name: string;
  total_sum: number;
}
