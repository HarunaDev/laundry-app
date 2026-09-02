import type { JSX } from "react";

import PageHeader from "../../components/ui/PageHeader";
import DashboardStats from "./components/layout/DashboardStats";
import OrdersOverview from "./components/layout/OrdersOverview";
import RecentOrders from "../../components/ui/RecentOrders";
import RevenueOverview from "../../components/ui/RevenueOverview";

const Home = (): JSX.Element => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, John! Here's what's happening today."
      />

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OrdersOverview />

        <RecentOrders />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RevenueOverview />
      </div>
    </div>
  );
};

export default Home;