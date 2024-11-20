"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ProductAnalytics } from "@/lib/types";

interface OverviewProps {
  data: ProductAnalytics[];
}

export function Overview({ data }: OverviewProps) {
  const chartData = data.map((item) => ({
    name: item.product?.name || `Product ${item.product_id}`,
    total: item.total_sales_amount,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}