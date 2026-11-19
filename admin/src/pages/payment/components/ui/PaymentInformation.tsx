
import type { Payment } from "../../../../types/payments";

import StatusBadge from "../../../../components/ui/StatusBadge";

interface PaymentInformationProps {
  payments: Payment[];
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-900">
      {value}
    </p>
  </div>
);

const PaymentInformation = ({
  payments,
}: PaymentInformationProps) => {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          No payment records were found for this order.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-900">
                Payment #{payment.id}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Created {formatDate(payment.createdAt)}
              </p>
            </div>

            <StatusBadge status={payment.paymentStatus} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Amount"
              value={formatCurrency(payment.amount)}
            />

            <DetailItem
              label="Payment Method"
              value={payment.paymentMethod}
            />

            <DetailItem
              label="Receipt"
              value={payment.receiptFileName ?? "Not uploaded"}
            />

            <DetailItem
              label="Receipt Uploaded"
              value={formatDate(payment.receiptUploadedAt)}
            />

            <DetailItem
              label="Confirmed At"
              value={formatDate(payment.confirmedAt)}
            />

            <DetailItem
              label="Confirmed By"
              value={payment.confirmedBy ?? "—"}
            />

            <DetailItem
              label="Rejected At"
              value={formatDate(payment.rejectedAt)}
            />

            <DetailItem
              label="Rejected By"
              value={payment.rejectedBy ?? "—"}
            />
          </div>

          {payment.rejectionReason && (
            <div className="mt-5 rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                Rejection Reason
              </p>
              <p className="mt-1 text-sm text-red-600">
                {payment.rejectionReason}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentInformation;