
import { useCallback, useState } from "react";

import {
  useDownloadPaymentReceiptMutation,
  useGetPaymentReceiptHistoryQuery,
} from "../../../redux/slices/paymentApiSlice";

import type { PaymentReceipt } from "../../../types/payments";

interface UsePaymentReceiptActionsResult {
  receipts: PaymentReceipt[];
  isLoadingHistory: boolean;
  isFetchingHistory: boolean;
  historyError: unknown;
  isDownloading: boolean;
  downloadingReceiptId: number | null;
  downloadError: string | null;
  downloadReceipt: (
    fileName: string,
    receiptId?: number,
  ) => Promise<void>;
  viewReceipt: (
    fileName: string,
    receiptId?: number,
  ) => Promise<void>;
  refetchHistory: () => void;
}

export const usePaymentReceiptActions = (
  orderId: number,
): UsePaymentReceiptActionsResult => {
  const {
    data,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
    error: historyError,
    refetch,
  } = useGetPaymentReceiptHistoryQuery(orderId, {
    skip: !Number.isInteger(orderId) || orderId <= 0,
  });

  const [downloadPaymentReceipt] =
    useDownloadPaymentReceiptMutation();

  const [downloadingReceiptId, setDownloadingReceiptId] =
    useState<number | null>(null);

  const [downloadError, setDownloadError] =
    useState<string | null>(null);

  const downloadFile = useCallback(
    async (
      fileName: string,
      receiptId?: number,
      shouldPreview = false,
    ): Promise<void> => {
      setDownloadError(null);

      // Open a blank tab immediately to reduce popup-blocker issues.
      const previewWindow = shouldPreview
        ? window.open("about:blank", "_blank")
        : null;

      if (shouldPreview && !previewWindow) {
        setDownloadError(
          "Your browser blocked the preview window. Please allow pop-ups and try again.",
        );
        return;
      }

      setDownloadingReceiptId(receiptId ?? 0);

      try {
        const blob = await downloadPaymentReceipt({
          orderId,
          receiptId,
        }).unwrap();

        const fileUrl = URL.createObjectURL(blob);

        if (shouldPreview && previewWindow) {
          previewWindow.location.href = fileUrl;

          // Keep the object URL alive while the browser loads the file.
          window.setTimeout(() => {
            URL.revokeObjectURL(fileUrl);
          }, 60_000);

          return;
        }

        const link = document.createElement("a");

        link.href = fileUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => {
          URL.revokeObjectURL(fileUrl);
        }, 1_000);
      } catch {
        previewWindow?.close();

        setDownloadError(
          "Unable to retrieve this receipt. Please try again.",
        );
      } finally {
        setDownloadingReceiptId(null);
      }
    },
    [downloadPaymentReceipt, orderId],
  );

  const downloadReceipt = useCallback(
    (fileName: string, receiptId?: number) =>
      downloadFile(fileName, receiptId, false),
    [downloadFile],
  );

  const viewReceipt = useCallback(
    (fileName: string, receiptId?: number) =>
      downloadFile(fileName, receiptId, true),
    [downloadFile],
  );

  return {
    receipts: data?.data ?? [],
    isLoadingHistory,
    isFetchingHistory,
    historyError,
    isDownloading: downloadingReceiptId !== null,
    downloadingReceiptId,
    downloadError,
    downloadReceipt,
    viewReceipt,
    refetchHistory: () => {
      void refetch();
    },
  };
};
