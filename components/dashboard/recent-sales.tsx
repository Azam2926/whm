import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sale } from "@/lib/types";

interface RecentSalesProps {
  data: Sale[];
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {data.slice(0, 5).map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {sale.customer?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.customer?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {sale.product?.name}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +${sale.price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}