import { generalApiSlice } from "../apiSlice";

import type { Payment, PaymentApiResponse, PaymentFilters, RejectPaymentRequest, UploadReceiptRequest } from "../../types/payments";

const paymentApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentApiResponse<Payment[]>, PaymentFilters>({
      query: (params) => ({
        url: "/payments",
        method: "GET",
        params,
      }),
      providesTags: (result) => [
        "Payment",
        ...(result?.data ?? []).map((payment) => ({
          type: "Payment" as const,
          id: payment.laundryOrderId,
        })),
      ],
    }),

    getPaymentByOrderId: builder.query<PaymentApiResponse<Payment[]>, number>({
      query: (orderId) => ({
        url: `/payments/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (
        _result,
        _error,
        orderId
      ) => [
        {
          type: "Payment",
          id: orderId,
        },
      ],
    }),

    getPaymentReceipt: builder.query<PaymentApiResponse<Payment>, number>({
      query: (orderId) => ({
        url: `/payments/orders/${orderId}/receipt`,
        method: "GET",
      }),
      providesTags: (
        _result,
        _error,
        orderId
      ) => [
        {
          type: "Payment",
          id: orderId,
        },
      ],
    }),

    uploadReceipt: builder.mutation<PaymentApiResponse<Payment>, UploadReceiptRequest>({
      query: ({orderId, file}) => {
        const formData = new FormData();

        formData.append("file", file);
        
        return {
            url: `/payments/orders/${orderId}/receipt`,
            method: "POST",
            body: formData,
        }
      },
      invalidatesTags: (_result, _error, { orderId }) => [
        "Payment",
        { type: "Payment", id: orderId },
      ],
    }),

    confirmPayment: builder.mutation<
      PaymentApiResponse<Payment>, number>({
      query: (orderId) => ({
        url: `/payment/orders/${orderId}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, orderId ) => [
        "Payment",
        { type: "Payment", id: orderId },
      ],
    }),

    rejectPayment: builder.mutation<
      PaymentApiResponse<Payment>, RejectPaymentRequest>({
      query: ({ orderId, reason }) => ({
        url: `/payment/orders/${orderId}/reject`,
        method: "PUT",
        body: { reason }
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        "Payment",
        { type: "Payment", id: orderId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByOrderIdQuery,
  useGetPaymentReceiptQuery,
  useUploadReceiptMutation,
  useConfirmPaymentMutation,
  useRejectPaymentMutation,
} = paymentApiSlice;

export default paymentApiSlice;
