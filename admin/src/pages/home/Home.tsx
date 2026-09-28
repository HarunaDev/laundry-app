import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import PageHeader from "../../components/ui/PageHeader";
import DashboardStats from "./components/layout/DashboardStats";
import OrdersOverview from "./components/layout/OrdersOverview";
import RecentOrders from "./components/ui/RecentOrders";
import RevenueOverview from "./components/ui/RevenueOverview";

import { useDashboardMetrics } from "./hooks/useDashboardMetricsQuery";

import type { DashboardPeriod } from "../../redux/slices/dashboardApiSlice";

import type { RootState } from "../../redux/store";

const Home = (): JSX.Element => {
  const [period, setPeriod] = useState<DashboardPeriod>("week");

  const userInfo = useSelector((state: RootState) => state.app.userInfo);

  const { data, isLoading, isFetching, isError } = useDashboardMetrics(period);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${
          userInfo?.userName ?? "there"
        }! Here's what's happening today.`}
      />

      <DashboardStats summary={data?.summary ?? null} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OrdersOverview
          data={data?.ordersOverview ?? []}
          period={period}
          onPeriodChange={setPeriod}
          isLoading={isLoading}
          isFetching={isFetching}
        />

        <RecentOrders
          data={data?.recentOrders ?? []}
          // period={period}
          // onPeriodChange={setPeriod}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RevenueOverview
          summary={data?.summary ?? null}
          data={data?.revenueOverview ?? []}
          period={period}
          onPeriodChange={setPeriod}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>

      {isError && (
        <p className="text-sm text-red-600">
          Unable to load dashboard metrics.
        </p>
      )}
    </div>
  );
};

export default Home;
