import type { JSX } from "react";
import {
  ClipboardList,
  CircleCheck,
  DollarSign,
  Users,
} from "lucide-react";

import StatCard from "../../../../components/ui/StatCard";

import type { DashboardSummary } from "../../../../redux/slices/dashboardApiSlice";
import { formatPercentage } from "../../../../utils/formartPercentage";
import { formatCurrency } from "../../../../utils/formatCurrency";

interface DashboardStatsProps {
  summary: DashboardSummary | null;
  isLoading: boolean;
}

const DashboardStats = ({summary, isLoading}: DashboardStatsProps): JSX.Element => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  const totalOrders = summary?.totalOrders ?? 0;
  const completedOrders = summary?.completedOrders ?? 0;
  const totalRevenue = summary?.totalRevenue ?? 0;
  const newCustomers = summary?.newCustomers ?? 0;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        icon={
          <ClipboardList
            size={20}
            className="text-blue-600"
          />
        }
        change={`${formatPercentage(
          summary?.ordersChangePercentage ?? 0
        )} from last week`}
      />

      <StatCard
        title="Completed Orders"
        value={completedOrders.toLocaleString()}
        icon={
          <CircleCheck
            size={20}
            className="text-green-600"
          />
        }
        change={`${formatPercentage(
          summary?.completedOrdersChangePercentage ?? 0
        )} from last week`}
      />

      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={
          <DollarSign
            size={20}
            className="text-orange-500"
          />
        }
        change={`${formatPercentage(
          summary?.revenueChangePercentage ?? 0
        )} from last week`}
      />

      <StatCard
        title="New Customers"
        value={newCustomers.toLocaleString()}
        icon={
          <Users
            size={20}
            className="text-purple-600"
          />
        }
        change={`${formatPercentage(
          summary?.newCustomersChangePercentage ?? 0
        )} from last week`}
      />
    </div>
  );
};

export default DashboardStats;