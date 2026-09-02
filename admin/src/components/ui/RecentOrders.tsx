import type { JSX } from "react";
import SectionCard from "./SectionCard";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Cancelled";

interface Order {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
}

const orders: Order[] = [
  {
    id: "#ORD-00156",
    customer: "John Doe",
    date: "May 18, 2024",
    status: "Pending",
  },
  {
    id: "#ORD-00155",
    customer: "Jane Smith",
    date: "May 18, 2024",
    status: "Processing",
  },
  {
    id: "#ORD-00154",
    customer: "Robert Johnson",
    date: "May 17, 2024",
    status: "Completed",
  },
  {
    id: "#ORD-00153",
    customer: "Emily Davis",
    date: "May 17, 2024",
    status: "Completed",
  },
  {
    id: "#ORD-00152",
    customer: "Michael Brown",
    date: "May 16, 2024",
    status: "Cancelled",
  },
];

const getStatusStyles = (
  status: OrderStatus
): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-50 text-yellow-600";

    case "Processing":
      return "bg-blue-50 text-blue-600";

    case "Completed":
      return "bg-green-50 text-green-600";

    case "Cancelled":
      return "bg-red-50 text-red-600";
  }
};

const RecentOrders = (): JSX.Element => {
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
      <div className="overflow-x-auto">
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
      </div>
    </SectionCard>
  );
};

export default RecentOrders;