import type { JSX } from "react";

import DataTable from
  "../../../../components/layout/DataTable";

import StatusBadge from
  "../../../../components/ui/StatusBadge";

import type {
  TableColumn,
} from "../../../../components/layout/DataTable";

import type {
  LaundryOrder,
} from "../../../../types/orders";

interface OrdersTableProps {
  orders: LaundryOrder[];

  isLoading: boolean;

  onOrderClick?: (
    order: LaundryOrder
  ) => void;
}

const formatCurrency = (
  amount: number
): string => {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",

      currency: "USD",
    }
  ).format(amount);
};

const formatDate = (
  date: string
): string => {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",

      day: "numeric",

      year: "numeric",
    }
  ).format(
    new Date(date)
  );
};

const OrdersTable = ({
  orders,
  isLoading,
}: OrdersTableProps): JSX.Element => {

  const columns: TableColumn<LaundryOrder>[] = [
    {
      key: "orderId",

      header: "Order ID",

      render: (order) => (
        <span
          className="
            font-medium
            text-blue-600
          "
        >
          #ORD-{order.id}
        </span>
      ),
    },

    {
      key: "customer",

      header: "Customer",

      render: (order) =>
        order.customerName,
    },

    {
      key: "deliveryMethod",

      header: "Delivery Method",

      render: (order) =>
        order.deliveryMethod,
    },

    {
      key: "amount",

      header: "Amount",

      render: (order) =>
        formatCurrency(
          order.grandTotal
        ),
    },

    {
      key: "status",

      header: "Status",

      render: (order) => (
        <StatusBadge
          status={order.status}
        />
      ),
    },

    {
      key: "date",

      header: "Date",

      render: (order) =>
        formatDate(
          order.createdAt
        ),
    },
  ];

  return (
    <DataTable<LaundryOrder>
      data={orders}

      columns={columns}

      getRowKey={(order) =>
        order.id
      }

      isLoading={isLoading}

      emptyMessage="
        No orders found.
      "
    />
  );
};

export default OrdersTable;