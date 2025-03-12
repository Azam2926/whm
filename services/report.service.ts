import api from "./http.service";
import {
  ReportCategoryWiseSales,
  ReportDailyTurnOver,
  ReportMonthlyTurnOver,
  ReportRecentSales,
  ReportTotals,
} from "@/lib/types/reports";
import { formatDate } from "@/utils/utils";

const reportService = {
  get_daily_turn_over: async () => {
    const response = await api.get<ReportDailyTurnOver>(
      "reports/daily-turn-over",
      { params: { localDate: formatDate(new Date(), "yyyy-MM-dd") } },
    );
    return response.data;
  },

  get_monthly_turn_over: async () => {
    const response = await api.get<ReportMonthlyTurnOver>(
      "reports/monthly-turn-over",
      { params: { month: formatDate(new Date(), "yyyy-MM") } },
    );
    return response.data;
  },

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
