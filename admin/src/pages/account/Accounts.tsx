import { useState } from "react";
import { Plus } from "lucide-react";

import { useAccounts } from "./hooks/useAccounts";

import type {
  LaundryAccounts,
  CreateLaundryAccountRequest,
  UpdateLaundryAccountRequest,
} from "../../redux/slices/accountApiSlice";
import AccountTable from "./components/layout/AccountTable";
import AccountModal from "./components/ui/AccountModal";

const Accounts = () => {
  const {
    accounts,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<LaundryAccounts | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<LaundryAccounts | null>(
    null
  );

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: LaundryAccounts) => {
    setSelectedAccount(account);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedAccount(null);
    setSaveError(null);
  };

  const handleSubmitAccount = async (
    data: CreateLaundryAccountRequest | UpdateLaundryAccountRequest
  ): Promise<void> => {
    try {
      setSaveError(null);
      if (selectedAccount) {
        if (!("isActive" in data)) {
          throw new Error(
            "Account status is required when updating an account"
          );
        }
        await updateAccount(selectedAccount.id, data);
      } else {
        await createAccount(data);
      }

      setIsModalOpen(false);
      setSelectedAccount(null);
    } catch {
      setSaveError(
        selectedAccount
          ? "Unable to update this account. Please try again."
          : "Unable to create this account. Please try again."
      );
    }
  };

  const handleDeleteClick = (account: LaundryAccounts) => {
    setDeleteError(null);
    setDeleteTarget(account);
  };

  const handleCloseDelete = () => {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteError(null);

      await deleteAccount(deleteTarget.id);

      setDeleteTarget(null);
    } catch {
      setDeleteError("Unable to delete this account. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
      >
        <div>
          <h1
            className="
                text-2xl
                font-semibold
                text-gray-900
              "
          >
            Accounts
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the laundry accounts available to customers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddAccount}
          className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-violet-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-violet-700
            "
        >
          <Plus size={18} />
          Add Account
        </button>
      </div>

      <div
        className="
            overflow-hidden
            rounded-xl
            border
            border-gray-100
            bg-white
          "
      >
        <AccountTable
          accounts={accounts}
          isLoading={isLoading}
          onEdit={handleEditAccount}
          onDelete={handleDeleteClick}
        />
      </div>

      <AccountModal
        key={selectedAccount?.id ?? "new"}
        isOpen={isModalOpen}
        account={selectedAccount}
        isSubmitting={isCreating || isUpdating}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAccount}
      />

      {/* {isModalOpen && saveError && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              px-4
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <div
              className="
                w-full
                max-w-md
                rounded-xl
                bg-white
                p-6
                shadow-xl
              "
            >
              <h2
                id="delete-account-title"
                className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
              >
                Delete Account
              </h2>
  
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {deleteTarget?.accountName}
                </span>
                ?
              </p>
  
              <p className="mt-2 text-xs text-gray-500">
                This action cannot be undone.
              </p>
  
              {deleteError && (
                <p
                  className="
                    mt-4
                    rounded-lg
                    bg-red-50
                    px-3
                    py-2
                    text-sm
                    text-red-600
                  "
                >
                  {deleteError}
                </p>
              )}
  
              <div
                className="
                  mt-6
                  flex
                  justify-end
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={handleCloseDelete}
                  disabled={isDeleting}
                  className="
                    rounded-lg
                    border
                    border-gray-200
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition-colors
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>
  
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isDeleting
                    ? "Deleting..."
                    : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )} */}

      {isModalOpen && saveError && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-60
            rounded-lg
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
            shadow-lg
          "
          role="alert"
        >
          {saveError}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div
            className="
              w-full
              max-w-md
              rounded-xl
              bg-white
              p-6
              shadow-xl
            "
          >
            <h2
              id="delete-account-title"
              className="text-lg font-semibold text-gray-900"
            >
              Delete Account
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget.accountName}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone.
            </p>

            {deleteError && (
              <p
                className="
                  mt-4
                  rounded-lg
                  bg-red-50
                  px-3
                  py-2
                  text-sm
                  text-red-600
                "
                role="alert"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDelete}
                disabled={isDeleting}
                className="
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition-colors
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
