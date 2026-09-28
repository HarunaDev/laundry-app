import type { JSX } from "react";
import SectionCard from "../../../../components/ui/SectionCard";

import type {
  DashboardPeriod,
  OrdersOverviewItem,
} from "../../../../redux/slices/dashboardApiSlice";

interface RecentOrdersProps {
  data: OrdersOverviewItem[];
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  isLoading: boolean;
  isFetching: boolean;
}

type OrderStatus = "Pending" | "InProgress" | "Completed" | "Cancelled";

const getStatusStyles = (status: OrderStatus): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-50 text-yellow-600";

    case "InProgress":
      return "bg-blue-50 text-blue-600";

    case "Completed":
      return "bg-green-50 text-green-600";

    case "Cancelled":
      return "bg-red-50 text-red-600";

    default:
      return "bg-gray-50 text-gray-600";
  }
};

const RecentOrders = ({
  data,
  isLoading,
  isFetching,
}: RecentOrdersProps): JSX.Element => {
  return (
    <SectionCard
      title="Recent Orders"
      action={
        <button
          type="button"
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      }
    >
      {/* <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="pb-3 font-medium">
                Order ID
              </th>

              <th className="pb-3 font-medium">
                Customer
              </th>

              <th className="pb-3 font-medium">
                Date
              </th>

              <th className="pb-3 font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-3 text-xs font-medium text-gray-700">
                  {order.id}
                </td>

                <td className="py-3 text-xs text-gray-600">
                  {order.customer}
                </td>

                <td className="py-3 text-xs text-gray-500">
                  {order.date}
                </td>

                <td className="py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {isLoading ? (
        <div className="py-10 text-center text-sm text-gray-400">
          {" "}
          Loading orders...{" "}
        </div>
      ) : data.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400">
          {" "}
          No recent orders.{" "}
        </div>
      ) : (
        <div className="overflow-x-auto">
          {" "}
          {isFetching && (
            <p className="mb-2 text-right text-xs text-gray-400">
              {" "}
              Updating...{" "}
            </p>
          )}{" "}
          <table className="w-full text-left">
            {" "}
            <thead>
              {" "}
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                {" "}
                <th className="pb-3 font-medium"> Order ID </th>{" "}
                <th className="pb-3 font-medium"> Customer </th>{" "}
                <th className="pb-3 font-medium"> Date </th>{" "}
                <th className="pb-3 font-medium"> Status </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {data.map((order) => (
                <tr
                  key={order.date}
                  className="border-b border-gray-50 last:border-0"
                >
                  {" "}
                  <td className="py-3 text-xs font-medium text-gray-700">
                    {" "}
                    {order.date}{" "}
                  </td>{" "}
                  <td className="py-3 text-xs text-gray-600"> — </td>{" "}
                  <td className="py-3 text-xs text-gray-500"> {order.date} </td>{" "}
                  <td className="py-3">
                    {" "}
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${getStatusStyles(
                        "InProgress"
                      )}`}
                    >
                      {" "}
                      Processing{" "}
                    </span>{" "}
                  </td>{" "}
                </tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>
      )}
    </SectionCard>
  );
};

export default RecentOrders;
