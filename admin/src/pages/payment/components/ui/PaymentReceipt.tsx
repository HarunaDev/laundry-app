
import { useRef, useState } from "react";

import type { Payment } from "../../../../types/payments";

interface PaymentReceiptProps {
  payments: Payment[];
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const PaymentReceipt = ({
  payments,
  onUpload,
  isUploading,
}: PaymentReceiptProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
  );

  const [validationError, setValidationError] = useState("");

  const latestReceipt = payments.find(
    (payment) => payment.receiptFileName,
  );

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setValidationError("");
    setSelectedFile(null);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setValidationError("Please select a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError("The receipt must not exceed 5 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    await onUpload(selectedFile);

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">
        Payment Receipt
      </h2>

      {latestReceipt ? (
        <div className="mt-4 rounded-md border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-red-50 p-3 text-red-600">
              PDF
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {latestReceipt.receiptFileName}
              </p>

              <p className="text-xs text-gray-500">
                {latestReceipt.receiptFileSize
                  ? `${(latestReceipt.receiptFileSize / 1024).toFixed(1)} KB`
                  : "File size unavailable"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">
          No receipt has been uploaded for this order.
        </p>
      )}

      <div className="mt-5 border-t border-gray-100 pt-5">
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
          accept="application/pdf"
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
          onClick={handleUpload}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Receipt"}
        </button>
      </div>
    </div>
  );
};

export default PaymentReceipt;