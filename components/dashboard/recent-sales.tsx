import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReportRecentSales } from "@/lib/types/reports";

interface RecentSalesProps {
  data: ReportRecentSales[];
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {data.slice(0, 5).map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {sale.customer_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.customer_name}
            </p>
            <p className="text-sm text-muted-foreground">{sale.product_name}</p>
          </div>
          <div className="ml-auto font-medium">
            +${sale.total_price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
