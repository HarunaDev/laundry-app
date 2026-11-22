
// import { useRef, useState } from "react";

// import type { Payment } from "../../../../types/payments";

// interface PaymentReceiptProps {
//   payments: Payment[];
//   onUpload: (file: File) => Promise<void>;
//   isUploading: boolean;
// }

// const MAX_FILE_SIZE = 5 * 1024 * 1024;

// const PaymentReceipt = ({
//   payments,
//   onUpload,
//   isUploading,
// }: PaymentReceiptProps) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedFile, setSelectedFile] = useState<File | null>(
//     null,
//   );

//   const [validationError, setValidationError] = useState("");

//   const latestReceipt = payments.find(
//     (payment) => payment.receiptFileName,
//   );

//   const handleFileChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = event.target.files?.[0];

//     setValidationError("");
//     setSelectedFile(null);

//     if (!file) return;

//     if (file.type !== "application/pdf") {
//       setValidationError("Please select a PDF file.");
//       return;
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       setValidationError("The receipt must not exceed 5 MB.");
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     await onUpload(selectedFile);

//     setSelectedFile(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <div className="rounded-lg border border-gray-200 bg-white p-6">
//       <h2 className="font-semibold text-gray-900">
//         Payment Receipt
//       </h2>

//       {latestReceipt ? (
//         <div className="mt-4 rounded-md border border-gray-100 p-4">
//           <div className="flex items-center gap-3">
//             <div className="rounded-md bg-red-50 p-3 text-red-600">
//               PDF
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-sm font-medium text-gray-900">
//                 {latestReceipt.receiptFileName}
//               </p>

//               <p className="text-xs text-gray-500">
//                 {latestReceipt.receiptFileSize
//                   ? `${(latestReceipt.receiptFileSize / 1024).toFixed(1)} KB`
//                   : "File size unavailable"}
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p className="mt-3 text-sm text-gray-500">
//           No receipt has been uploaded for this order.
//         </p>
//       )}

//       <div className="mt-5 border-t border-gray-100 pt-5">
//         <label
//           htmlFor="receipt-upload"
//           className="mb-2 block text-sm font-medium text-gray-700"
//         >
//           Upload receipt
//         </label>

//         <input
//           ref={fileInputRef}
//           id="receipt-upload"
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//           className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium"
//         />

//         {selectedFile && (
//           <p className="mt-2 text-sm text-gray-600">
//             Selected: {selectedFile.name}
//           </p>
//         )}

//         {validationError && (
//           <p className="mt-2 text-sm text-red-600">
//             {validationError}
//           </p>
//         )}

//         <button
//           type="button"
//           disabled={!selectedFile || isUploading}
//           onClick={handleUpload}
//           className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {isUploading ? "Uploading..." : "Upload Receipt"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentReceipt;


import { useRef, useState } from "react";

import type { Payment } from "../../../../types/payments";
import { usePaymentReceiptActions } from "../../hooks/usePaymentReceiptActions";

interface PaymentReceiptProps {
  orderId: number;
  payments: Payment[];
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const formatFileSize = (size: number): string => {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const PaymentReceipt = ({
  orderId,
  payments,
  onUpload,
  isUploading,
}: PaymentReceiptProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState("");

  const {
    receipts,
    isLoadingHistory,
    isFetchingHistory,
    historyError,
    isDownloading,
    downloadingReceiptId,
    downloadError,
    downloadReceipt,
    viewReceipt,
  } = usePaymentReceiptActions(orderId);

  const latestReceipt =
    receipts.find((receipt) => receipt.isCurrent) ?? receipts[0];

  const payment = payments[0];

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setValidationError("");
    setSelectedFile(null);

    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setValidationError(
        "Please select a PDF, JPG or PNG file.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError(
        "The receipt must not exceed 5 MB.",
      );
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await onUpload(selectedFile);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setValidationError(
        "Unable to upload receipt. Please try again.",
      );
    }
  };

  const getReceiptStatus = (
    isCurrent: boolean,
    isRejected: boolean,
  ): { label: string; className: string } => {
    if (isRejected) {
      return {
        label: "Rejected",
        className: "bg-red-50 text-red-700",
      };
    }

    if (isCurrent && payment?.paymentStatus === "Paid") {
      return {
        label: "Approved",
        className: "bg-green-50 text-green-700",
      };
    }

    if (isCurrent) {
      return {
        label: "Current",
        className: "bg-blue-50 text-blue-700",
      };
    }

    return {
      label: "Previous submission",
      className: "bg-gray-100 text-gray-600",
    };
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <h2 className="font-semibold text-gray-900">
          Payment Receipt
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View the latest receipt and access previous submissions.
        </p>
      </div>

      {/* Current receipt */}
      <div className="mt-5">
        <h3 className="text-sm font-medium text-gray-700">
          Current receipt
        </h3>

        {isLoadingHistory ? (
          <p className="mt-3 text-sm text-gray-500">
            Loading receipt...
          </p>
        ) : latestReceipt ? (
          <div className="mt-3 rounded-md border border-gray-200 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                  {latestReceipt.contentType === "application/pdf"
                    ? "PDF"
                    : "IMG"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {latestReceipt.fileName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {formatFileSize(latestReceipt.fileSize)}
                    {" · "}
                    Uploaded {formatDate(latestReceipt.uploadedAt)}
                  </p>
                </div>
              </div>

              {latestReceipt.isFileAvailable ? (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() =>
                      void viewReceipt(latestReceipt.fileName)
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() =>
                      void downloadReceipt(latestReceipt.fileName)
                    }
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {downloadingReceiptId === 0
                      ? "Downloading..."
                      : "Download"}
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500">
                  File unavailable
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            No receipt has been uploaded for this order.
          </p>
        )}
      </div>

      {/* Receipt history */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">
            Receipt history
          </h3>

          {isFetchingHistory && !isLoadingHistory && (
            <span className="text-xs text-gray-500">
              Refreshing...
            </span>
          )}
        </div>

        {historyError ? (
          <p className="mt-3 text-sm text-red-600">
            Unable to retrieve receipt history.
          </p>
        ) : isLoadingHistory ? (
          <p className="mt-3 text-sm text-gray-500">
            Loading receipt history...
          </p>
        ) : receipts.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No receipt history available.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-gray-100">
            {receipts.map((receipt) => {
              const status = getReceiptStatus(
                receipt.isCurrent,
                receipt.isRejected,
              );

              const isThisReceiptDownloading =
                downloadingReceiptId === receipt.id;

              return (
                <div
                  key={receipt.id}
                  className="py-4 first:pt-2 last:pb-0"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {receipt.fileName}
                        </p>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatFileSize(receipt.fileSize)}
                        {" · "}
                        {formatDate(receipt.uploadedAt)}
                      </p>

                      {receipt.isRejected &&
                        receipt.rejectionReason && (
                          <div className="mt-2 rounded-md bg-red-50 p-3">
                            <p className="text-xs font-medium text-red-700">
                              Rejection reason
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                              {receipt.rejectionReason}
                            </p>
                          </div>
                        )}

                      {!receipt.isFileAvailable && (
                        <p className="mt-2 text-xs text-gray-500">
                          This receipt file is no longer available.
                        </p>
                      )}
                    </div>

                    {receipt.isFileAvailable && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          disabled={isDownloading}
                          onClick={() =>
                            void viewReceipt(
                              receipt.fileName,
                              receipt.id,
                            )
                          }
                          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          disabled={isDownloading}
                          onClick={() =>
                            void downloadReceipt(
                              receipt.fileName,
                              receipt.id,
                            )
                          }
                          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isThisReceiptDownloading
                            ? "Downloading..."
                            : "Download"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {downloadError && (
          <p className="mt-3 text-sm text-red-600">
            {downloadError}
          </p>
        )}
      </div>

      {/* Upload receipt */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <label
          htmlFor="receipt-upload"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Upload receipt
        </label>

        <input
          ref={fileInputRef}
          id="receipt-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium"
        />

        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedFile.name}
          </p>
        )}

        {validationError && (
          <p className="mt-2 text-sm text-red-600">
            {validationError}
          </p>
        )}

        <button
          type="button"
          disabled={!selectedFile || isUploading}
          onClick={() => void handleUpload()}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Receipt"}
        </button>
      </div>
    </div>
  );
};

export default PaymentReceipt;
