import api from "./http.service";
import {
  ReportCategoryWiseSales,
  ReportRecentSales,
  ReportTotals,
} from "@/lib/types/reports";

const reportService = {
  get_recent_sales: async (): Promise<ReportRecentSales[]> => {
    const response = await api.get<{ data: ReportRecentSales[] }>(
      "reports/recent-sale-products",
    );
    return response.data.data;
  },
  get_category_wise_total_sales: async (): Promise<
    ReportCategoryWiseSales[]
  > => {
    const response = await api.get<{ data: ReportCategoryWiseSales[] }>(
      "reports/category-wise-total-sales",
    );
    return response.data.data;
  },
  get_totals: async (): Promise<ReportTotals> => {
    const response = await api.get<ReportTotals>("reports/total-data");
    return response.data;
  },
};

export default reportService;
