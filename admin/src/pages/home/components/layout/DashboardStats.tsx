import type { JSX } from "react";
import {
  ClipboardList,
  CircleCheck,
  DollarSign,
  Users,
} from "lucide-react";

import StatCard from "../../../../components/ui/StatCard";

const DashboardStats = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Orders"
        value="156"
        icon={
          <ClipboardList
            size={20}
            className="text-blue-600"
          />
        }
        change="↑ 12.5% from last week"
      />

      <StatCard
        title="Completed Orders"
        value="120"
        icon={
          <CircleCheck
            size={20}
            className="text-green-600"
          />
        }
        change="↑ 8.2% from last week"
      />

      <StatCard
        title="Total Revenue"
        value="$2,450.00"
        icon={
          <DollarSign
            size={20}
            className="text-orange-500"
          />
        }
        change="↑ 15.3% from last week"
      />

      <StatCard
        title="New Customers"
        value="23"
        icon={
          <Users
            size={20}
            className="text-purple-600"
          />
        }
        change="↑ 5.7% from last week"
      />
    </div>
  );
};

export default DashboardStats;