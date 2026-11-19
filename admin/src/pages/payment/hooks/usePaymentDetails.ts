import {
  useGetPaymentByOrderIdQuery,
  useUploadReceiptMutation,
  useConfirmPaymentMutation,
  useRejectPaymentMutation,
} from "../../../redux/slices/paymentApiSlice";

import { useGetOrderByIdQuery } from "../../../redux/slices/ordersApiSlice";

import type { Payment } from "../../../types/payments";

export const usePaymentDetails = (orderId: number) => {
  const isValidOrderId = Number.isInteger(orderId) && orderId > 0;

  const {
    data: paymentResponse,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
    isError: isPaymentError,
    error: paymentError,
    refetch: refetchPayments,
  } = useGetPaymentByOrderIdQuery(orderId, {
    skip: !isValidOrderId,
  });

  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
    error: orderError,
  } = useGetOrderByIdQuery(orderId, {
    skip: !isValidOrderId,
  });

  const [uploadReceipt, uploadReceiptState] = useUploadReceiptMutation();

  const [confirmPayment, confirmPaymentState] = useConfirmPaymentMutation();

  const [rejectPayment, rejectPaymentState] = useRejectPaymentMutation();

  const paymentData = paymentResponse?.data;

  const payments: Payment[] = Array.isArray(paymentData) ? paymentData  : paymentData && typeof paymentData === "object" ? [paymentData as Payment] : [];

  return {
    order,
    payments,

    isLoading: isPaymentLoading || isOrderLoading,
    isFetching: isPaymentFetching,

    isPaymentError,
    isOrderError,
    paymentError,
    orderError,

    uploadReceipt,
    uploadReceiptState,

    confirmPayment,
    confirmPaymentState,

    rejectPayment,
    rejectPaymentState,

    refetchPayments,
  };
};