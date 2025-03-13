export interface Report {
  recent_sales: ReportRecentSales[];
  category_wise_total_sales: ReportCategoryWiseSales[];
  totals: ReportTotals;
  daily_turn_over: ReportDailyTurnOver;
  monthly_turn_over: ReportMonthlyTurnOver;
}

export const DEFAULT_REPORT = {
  recent_sales: [],
  category_wise_total_sales: [],
  totals: {
    total_products: 0,
    total_sales: 0,
    total_product_count: 0,
    total_customers: 0,
    total_summa: 0,
  },
  daily_turn_over: {
    sale_date: "",
    total_price: 0,
  },
  monthly_turn_over: {
    yearMonth: "",
    totalTurnover: 0,
  },
};

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

export interface ReportTotals {
  total_summa: number;
  total_products: number;
  total_sales: number;
  total_product_count: number;
  total_customers: number;
}

export interface ReportDailyTurnOver {
  sale_date: string;
  total_turn_over: number;
}

export interface ReportMonthlyTurnOver {
  yearMonth: string;
  totalTurnover: number;
}
