import {
  ReportDailyTurnOver,
  ReportMonthlyTurnOver,
  ReportTotals,
} from "@/lib/types/reports";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  BrickWall,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import {
  formatCurrency,
  getUzbekDayMonth,
  getUzbekMonthName,
} from "@/utils/utils";

interface MetricsProps {
  totals: ReportTotals;
  daily_turn_over: ReportDailyTurnOver;
  monthly_turn_over: ReportMonthlyTurnOver;
}
export default function Metrics({
  totals,
  daily_turn_over,
  monthly_turn_over,
}: MetricsProps) {
  return (
    <>
      <MetricCard
        title="Bugungi savdo"
        description={getUzbekDayMonth(daily_turn_over?.sale_date)}
        value={formatCurrency(daily_turn_over?.total_turn_over)}
        icon={ShoppingBag}
      />
      <MetricCard
        title="Oylik savdo"
        description={getUzbekMonthName(monthly_turn_over?.yearMonth)}
        value={formatCurrency(monthly_turn_over?.totalTurnover)}
        icon={Store}
      />
      <MetricCard
        title="Mahsulotlar"
        value={totals?.total_products}
        icon={Package}
      />
      <MetricCard
        title="Ombordagi qoldiq"
        value={formatCurrency(totals?.total_summa)}
        icon={BrickWall}
      />
      <MetricCard
        title="Sotuvlar"
        value={formatCurrency(totals?.total_sales)}
        icon={ShoppingCart}
      />
      <MetricCard
        title="Mijozlar"
        value={totals?.total_customers}
        icon={Users}
      />
    </>
  );
}
