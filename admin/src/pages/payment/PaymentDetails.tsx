
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";

import PaymentInformation from "./components/ui/PaymentInformation";
import PaymentReceipt from "./components/ui/PaymentReceipt";
import PaymentActions from "./components/ui/PaymentActions";

import { usePaymentDetails } from "./hooks/usePaymentDetails";

// import type { LaundryOrderDetails } from "../../types/orders";

const PaymentDetails = () => {
  const { orderId: orderIdParam } = useParams<{
    orderId: string;
  }>();

  const navigate = useNavigate();

  const orderId = Number(orderIdParam);

  const {
    order,
    payments,
    isLoading,
    isFetching,
    isPaymentError,
    isOrderError,
    uploadReceipt,
    uploadReceiptState,
    confirmPayment,
    confirmPaymentState,
    rejectPayment,
    rejectPaymentState,
    refetchPayments,
  } = usePaymentDetails(orderId);

  const pendingPayment = payments.find(
    (payment) => payment.paymentStatus === "Pending",
  );

  const canConfirm = Boolean(pendingPayment);
  const canReject = Boolean(pendingPayment);

  const handleUpload = async (file: File) => {
    try {
      await uploadReceipt({ orderId, file }).unwrap();
      await refetchPayments();
    } catch {
      // RTK Query exposes the mutation error through uploadReceiptState.
    }
  };

  const handleConfirm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this payment?",
    );

    if (!confirmed) return;

    try {
      await confirmPayment(orderId).unwrap();
      await refetchPayments();
    } catch {
      // RTK Query exposes the mutation error through confirmPaymentState.
    }
  };

  const handleReject = async (reason: string) => {
    try {
      await rejectPayment({ orderId, reason }).unwrap();
      await refetchPayments();
    } catch {
      // RTK Query exposes the mutation error through rejectPaymentState.
    }
  };

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return (
      <div className="rounded-lg bg-red-50 p-5 text-sm text-red-700">
        Invalid order ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading payment details...
      </div>
    );
  }

  if (isPaymentError || isOrderError) {
    return (
      <div className="rounded-lg bg-red-50 p-5 text-sm text-red-700">
        Unable to load payment or order details.
      </div>
    );
  }

//   const orderDetails = order as LaundryOrderDetails | undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Payment for Order #${orderId}`}
        description="View payment information and manage payment verification."
        breadcrumb={
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Payments", href: "/payments" },
              { label: `Order #${orderId}` },
            ]}
          />
        }
      />

      <button
        type="button"
        onClick={() => navigate("/payments")}
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to Payments
      </button>

      {/* Order and customer information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">
          Order Information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="mt-1 font-medium text-gray-900">
              #{order?.id ?? orderId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="mt-1 font-medium text-gray-900">
              {order?.customerName ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Customer ID</p>
            <p className="mt-1 font-medium text-gray-900">
              {order?.customerId ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Delivery Method</p>
            <p className="mt-1 font-medium text-gray-900">
              {order?.deliveryMethod ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Laundry Location</p>
            <p className="mt-1 font-medium text-gray-900">
              {order?.laundryLocation ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Order Total</p>
            <p className="mt-1 font-medium text-gray-900">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(order?.grandTotal ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment information */}
      <PaymentInformation payments={payments} />

      {/* Receipt */}
      <PaymentReceipt
        orderId={orderId}
        payments={payments}
        onUpload={handleUpload}
        isUploading={uploadReceiptState.isLoading}
      />

      {/* Payment actions */}
      <PaymentActions
        canConfirm={canConfirm}
        canReject={canReject}
        isConfirming={confirmPaymentState.isLoading}
        isRejecting={rejectPaymentState.isLoading}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />

      {isFetching && (
        <p className="text-xs text-gray-400">
          Refreshing payment information...
        </p>
      )}

      {uploadReceiptState.isError && (
        <p className="text-sm text-red-600">
          Receipt upload failed. Please try again.
        </p>
      )}

      {confirmPaymentState.isError && (
        <p className="text-sm text-red-600">
          Payment confirmation failed. Please try again.
        </p>
      )}

      {rejectPaymentState.isError && (
        <p className="text-sm text-red-600">
          Payment rejection failed. Please try again.
        </p>
      )}
    </div>
  );
};

export default PaymentDetails;