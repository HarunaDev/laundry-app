
import { Link } from "react-router-dom";
import type { TableColumn } from "../../../../components/layout/DataTable";
import DataTable from "../../../../components/layout/DataTable";
import StatusBadge from "../../../../components/ui/StatusBadge";

import type { Payment } from "../../../../types/payments";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value: string | null): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const columns: TableColumn<Payment>[] = [
  {
    key: "paymentId",
    header: "Payment ID",
    render: (payment) => `#${payment.id}`,
  },
  {
    key: "orderId",
    header: "Order ID",
    // render: (payment) => `#${payment.laundryOrderId}`,
    render: (payment) => (
        <Link
          to={`/payments/${payment.laundryOrderId}`}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          #{payment.laundryOrderId}
        </Link>
      ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (payment) => formatCurrency(payment.amount),
  },
  {
    key: "paymentMethod",
    header: "Payment Method",
    render: (payment) => payment.paymentMethod,
  },
  {
    key: "paymentStatus",
    header: "Status",
    render: (payment) => (
      <StatusBadge status={payment.paymentStatus} />
    ),
  },
  {
    key: "receipt",
    header: "Receipt",
    render: (payment) =>
      payment.receiptFileName ? "Uploaded" : "Not uploaded",
  },
  {
    key: "createdAt",
    header: "Date Created",
    render: (payment) => formatDate(payment.createdAt),
  },
];

// interface PaymentsTableComponentProps extends PaymentsTableProps {}

const PaymentsTable = ({
  payments,
  isLoading,
}: PaymentsTableProps) => {
  return (
    <DataTable<Payment>
      data={payments}
      columns={columns}
      getRowKey={(payment) => payment.id}
      isLoading={isLoading}
      emptyMessage="No payments found."
    />
  );
};

export default PaymentsTable;
