import { ReportTotals } from "@/lib/types/reports";
import MetricCard from "@/components/dashboard/MetricCard";
import { BrickWall, Package, ShoppingCart, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatDate";

interface MetricsProps {
  totals: ReportTotals;
}
export default function Metrics({ totals }: MetricsProps) {
  return (
    <>
      <MetricCard
        title="Mahsulotlar"
        value={totals?.total_products}
        icon={Package}
      />
      <MetricCard
        title="Sotuvlar"
        value={formatCurrency(totals?.total_sales)}
        icon={ShoppingCart}
      />
      <MetricCard
        title="Mahsulotlar soni"
        value={totals?.total_customers}
        icon={BrickWall}
      />
      <MetricCard
        title="Mijozlar"
        value={totals?.total_customers}
        icon={Users}
      />
    </>
  );
}
