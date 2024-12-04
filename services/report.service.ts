import api from "./http.service";
import {
  ReportCategoryWiseSales,
  ReportRecentSales
} from "@/lib/types/reports";

const reportService = {
  get_recent_sales: async () => {
    const response = await api.get<{ data: ReportRecentSales[] }>(
      "reports/recent-sale-products"
    );
    return response.data.data;
  },
  get_category_wise_total_sales: async () => {
    const response = await api.get<{ data: ReportCategoryWiseSales[] }>(
      "reports/category-wise-total-sales"
    );
    return response.data.data;
  }
};

export default reportService;
