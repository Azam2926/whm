"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { api } from "@/lib/services/api";
import { DEFAULT_REPORT, Report } from "@/lib/types/reports";
import Metrics from "@/components/dashboard/metrics";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TABS = {
  OVERVIEW: "overview",
  ANALYTICS: "analytics",
} as const;

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Report>(DEFAULT_REPORT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [analyticsData] = await Promise.all([api.getAnalytics()]);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(
        "Маълумотларни юклашда хатолик юз берди. Илтимос, қайта уриниб кўринг.",
      );
      console.error("Dashboard data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricsSkeleton />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <CategorySalesSkeleton />
            <RecentSalesSkeleton />
          </div>
        </>
      );
    }

    if (error) {
      return toast.error(error);
    }

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Metrics
            daily_turn_over={analytics.daily_turn_over}
            monthly_turn_over={analytics.monthly_turn_over}
            totals={analytics.totals}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <CategorySalesCard data={analytics.category_wise_total_sales} />
          <RecentSalesCard data={analytics.recent_sales} />
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <header className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Umumiy</h2>
        {!isLoading && !error && (
          <Button variant="ghost" onClick={fetchDashboardData}>
            Янгилаш
          </Button>
        )}
      </header>

      <Tabs defaultValue={TABS.OVERVIEW} className="space-y-4">
        <TabsList>
          <TabsTrigger value={TABS.OVERVIEW}>Umumiy</TabsTrigger>
          <TabsTrigger disabled value={TABS.ANALYTICS}>
            Analitka
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TABS.OVERVIEW} className="space-y-4">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RecentSalesSkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <Skeleton className="h-5 w-[140px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map(index => (
            <div key={index} className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4 space-y-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CategorySalesCard({
  data,
}: {
  data: Report["category_wise_total_sales"];
}) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Toifalar sotuvi</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Overview data={data} />
      </CardContent>
    </Card>
  );
}

function RecentSalesCard({ data }: { data: Report["recent_sales"] }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Oxirgi sotuvlar</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentSales data={data} />
      </CardContent>
    </Card>
  );
}

function MetricsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map(index => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

function CategorySalesSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="h-5 w-[140px]" />
      </CardHeader>
      <CardContent className="pl-2">
        <div className="space-y-2">
          <Skeleton className="h-[200px] w-full" />
          <div className="flex gap-2">
            {[1, 2, 3].map(index => (
              <Skeleton key={index} className="h-4 w-[100px]" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
