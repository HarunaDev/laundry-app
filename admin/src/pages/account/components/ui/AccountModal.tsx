
import {
    useState,
    type ChangeEvent,
    type FormEvent,
  } from "react";
  import { X } from "lucide-react";
  
  import type {
    LaundryAccounts,
    CreateLaundryAccountRequest,
    UpdateLaundryAccountRequest,
  } from "../../../../redux/slices/accountApiSlice";
  
  interface AccountModalProps {
    isOpen: boolean;
    account: LaundryAccounts | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (
      data: CreateLaundryAccountRequest | UpdateLaundryAccountRequest,
    ) => Promise<void>;
  }
  
  interface AccountForm {
    bankName: string;
    accountName: string;
    accountNumber: string;
    isActive: boolean;
  }
  
  const createInitialForm = (
    account: LaundryAccounts | null,
  ): AccountForm => {
    if (account) {
      return {
        bankName: account.bankName,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        isActive: account.isActive,
      };
    }
  
    return {
      bankName: "",
      accountName: "",
      accountNumber: "",
      isActive: true,
    };
  };
  
  const AccountModal = ({
    isOpen,
    account,
    isSubmitting,
    onClose,
    onSubmit,
  }: AccountModalProps) => {
    const [form, setForm] = useState<AccountForm>(() =>
      createInitialForm(account),
    );
  
    if (!isOpen) {
      return null;
    }
  
    const isEditing = account !== null;
  
    const handleChange = (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const { name, value, type, checked } = event.target;
  
      if (type === "checkbox") {
        setForm((current) => ({
          ...current,
          [name]: checked,
        }));
  
        return;
      }
  
      setForm((current) => ({
        ...current,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
  
      const bankName = form.bankName.trim();
      const accountName = form.accountName.trim();
      const accountNumber = form.accountNumber.trim();
  
      if (!bankName || !accountName || !accountNumber) {
        return;
      }
  
      if (isEditing) {
        await onSubmit({
          bankName,
          accountName,
          accountNumber,
          isActive: form.isActive,
        });
  
        return;
      }
  
      await onSubmit({
        bankName,
        accountName,
        accountNumber,
      });
    };
  
    return (
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
        aria-labelledby="account-modal-title"
      >
        <div
          className="
            w-full
            max-w-lg
            rounded-xl
            bg-white
            shadow-xl
          "
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-6
              py-4
            "
          >
            <div>
              <h2
                id="account-modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {isEditing ? "Edit Account" : "Add Account"}
              </h2>
  
              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Update the laundry bank account details."
                  : "Add a new bank account for customer payments."}
              </p>
            </div>
  
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-gray-500
                transition-colors
                hover:bg-gray-100
                hover:text-gray-900
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
  
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-6 py-6">
              {/* Bank name */}
              <div>
                <label
                  htmlFor="bank-name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Bank Name
                </label>
  
                <input
                  id="bank-name"
                  name="bankName"
                  type="text"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="e.g. Access Bank"
                  disabled={isSubmitting}
                  required
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:bg-gray-50
                  "
                />
              </div>
  
              {/* Account name */}
              <div>
                <label
                  htmlFor="account-name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Account Name
                </label>
  
                <input
                  id="account-name"
                  name="accountName"
                  type="text"
                  value={form.accountName}
                  onChange={handleChange}
                  placeholder="Enter account holder name"
                  disabled={isSubmitting}
                  required
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:bg-gray-50
                  "
                />
              </div>
  
              {/* Account number */}
              <div>
                <label
                  htmlFor="account-number"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Account Number
                </label>
  
                <input
                  id="account-number"
                  name="accountNumber"
                  type="text"
                  inputMode="numeric"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  disabled={isSubmitting}
                  required
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:bg-gray-50
                  "
                />
              </div>
  
              {/* Active status - edit only */}
              {isEditing && (
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-gray-100
                    bg-gray-50
                    px-4
                    py-3
                  "
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Active Account
                    </p>
  
                    <p className="mt-1 text-xs text-gray-500">
                      Allow customers to use this bank account for payments.
                    </p>
                  </div>
  
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="
                      h-4
                      w-4
                      rounded
                      border-gray-300
                      text-violet-600
                      focus:ring-violet-500
                    "
                  />
                </label>
              )}
            </div>
  
            {/* Footer */}
            <div
              className="
                flex
                justify-end
                gap-3
                border-t
                border-gray-100
                px-6
                py-4
              "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
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
                type="submit"
                disabled={
                  isSubmitting ||
                  !form.bankName.trim() ||
                  !form.accountName.trim() ||
                  !form.accountNumber.trim()
                }
                className="
                  rounded-lg
                  bg-violet-600
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-violet-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Add Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default AccountModal;
  