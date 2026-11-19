
import { useState } from "react";

interface PaymentActionsProps {
  canConfirm: boolean;
  canReject: boolean;
  isConfirming: boolean;
  isRejecting: boolean;
  onConfirm: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

const PaymentActions = ({
  canConfirm,
  canReject,
  isConfirming,
  isRejecting,
  onConfirm,
  onReject,
}: PaymentActionsProps) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");

  const handleReject = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) return;

    await onReject(trimmedReason);

    setReason("");
    setShowRejectForm(false);
  };

  if (!canConfirm && !canReject) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          No payment actions are currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">
        Payment Actions
      </h2>

      <div className="mt-4 flex flex-wrap gap-3">
        {canConfirm && (
          <button
            type="button"
            disabled={isConfirming || isRejecting}
            onClick={() => void onConfirm()}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isConfirming ? "Confirming..." : "Confirm Payment"}
          </button>
        )}

        {canReject && (
          <button
            type="button"
            disabled={isConfirming || isRejecting}
            onClick={() => setShowRejectForm((previous) => !previous)}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Reject Payment
          </button>
        )}
      </div>

      {showRejectForm && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <label
            htmlFor="rejection-reason"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Rejection reason
          </label>

          <textarea
            id="rejection-reason"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain why this payment is being rejected..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
          />

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              disabled={!reason.trim() || isRejecting}
              onClick={() => void handleReject()}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowRejectForm(false);
                setReason("");
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentActions;