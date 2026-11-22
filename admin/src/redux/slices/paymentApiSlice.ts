import { generalApiSlice } from "../apiSlice";

import type {
    GetPaymentsResponse,
  Payment,
  PaymentApiResponse,
  PaymentFilters,
  PaymentReceiptHistoryResponse,
  DownloadPaymentReceiptRequest,
  RejectPaymentRequest,
  UploadReceiptRequest,
} from "../../types/payments";

const paymentApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<GetPaymentsResponse, PaymentFilters>({
      query: (params) => ({
        url: "/payments",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const payments = result?.data?.items ?? [];

        return [
          "Payment",
          ...payments.map((payment) => ({
            type: "Payment" as const,
            id: payment.laundryOrderId,
          })),
        ];
      },
    }),

    getPaymentByOrderId: builder.query<PaymentApiResponse<Payment[]>, number>({
      query: (orderId) => ({
        url: `/payments/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, orderId) => [
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
      providesTags: (_result, _error, orderId) => [
        {
          type: "Payment",
          id: orderId,
        },
      ],
    }),

    // Get receipt history for an order.
    getPaymentReceiptHistory: builder.query<
      PaymentReceiptHistoryResponse,
      number
    >({
      query: (orderId) => ({
        url: `/payments/orders/${orderId}/receipts`,
        method: "GET",
      }),
      providesTags: (_result, _error, orderId) => [
        {
          type: "Payment",
          id: orderId,
        },
      ],
    }),

    // Download the current receipt or a historical receipt.
    downloadPaymentReceipt: builder.mutation<
      Blob,
      DownloadPaymentReceiptRequest
    >({
      query: ({ orderId, receiptId }) => ({
        url: receiptId
          ? `/payments/orders/${orderId}/receipts/${receiptId}`
          : `/payments/orders/${orderId}/receipt`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    uploadReceipt: builder.mutation<
      PaymentApiResponse<Payment>,
      UploadReceiptRequest
    >({
      query: ({ orderId, file }) => {
        const formData = new FormData();

        formData.append("file", file);

        return {
          url: `/payments/orders/${orderId}/receipt`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { orderId }) => [
        "Payment",
        { type: "Payment", id: orderId },
      ],
    }),

    confirmPayment: builder.mutation<PaymentApiResponse<Payment>, number>({
      query: (orderId) => ({
        url: `/payments/orders/${orderId}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, orderId) => [
        "Payment",
        { type: "Payment", id: orderId },
      ],
    }),

    rejectPayment: builder.mutation<
      PaymentApiResponse<Payment>,
      RejectPaymentRequest
    >({
      query: ({ orderId, reason }) => ({
        url: `/payments/orders/${orderId}/reject`,
        method: "PUT",
        body: { reason },
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
  useGetPaymentReceiptHistoryQuery,
  useDownloadPaymentReceiptMutation,
  useUploadReceiptMutation,
  useConfirmPaymentMutation,
  useRejectPaymentMutation,
} = paymentApiSlice;

export default paymentApiSlice;
