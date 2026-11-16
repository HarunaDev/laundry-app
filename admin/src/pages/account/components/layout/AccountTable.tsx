
import {
    MoreHorizontal,
    Pencil,
    Trash2,
  } from "lucide-react";
  
  import DataTable, {
    type TableColumn,
  } from "../../../../components/layout/DataTable";
  
  import type {
    LaundryAccounts,
  } from "../../../../redux/slices/accountApiSlice";
  
  interface AccountTableProps {
    accounts: LaundryAccounts[];
    isLoading: boolean;
    onEdit: (account: LaundryAccounts) => void;
    onDelete: (account: LaundryAccounts) => void;
  }
  
  const AccountTable = ({
    accounts,
    isLoading,
    onEdit,
    onDelete,
  }: AccountTableProps) => {
    const columns: TableColumn<LaundryAccounts>[] = [
      {
        key: "bankName",
        header: "Bank",
        render: (account) => (
          <p className="font-semibold text-gray-900">
            {account.bankName}
          </p>
        ),
      },
  
      {
        key: "accountName",
        header: "Account Name",
        render: (account) => (
          <p className="text-gray-700">
            {account.accountName}
          </p>
        ),
      },
  
      {
        key: "accountNumber",
        header: "Account Number",
        render: (account) => (
          <p className="font-medium text-gray-700">
            {account.accountNumber}
          </p>
        ),
      },
  
      {
        key: "status",
        header: "Status",
        render: (account) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              account.isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {account.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
  
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        render: (account) => (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onEdit(account)}
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
              "
              aria-label={`Edit ${account.bankName} account`}
            >
              <Pencil size={16} />
            </button>
  
            <button
              type="button"
              onClick={() => onDelete(account)}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-gray-500
                transition-colors
                hover:bg-red-50
                hover:text-red-600
              "
              aria-label={`Delete ${account.bankName} account`}
            >
              <Trash2 size={16} />
            </button>
  
            <button
              type="button"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-gray-400
              "
              aria-label={`More options for ${account.bankName} account`}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ),
      },
    ];
  
    return (
      <DataTable
        data={accounts}
        columns={columns}
        getRowKey={(account) => account.id}
        isLoading={isLoading}
        emptyMessage="No laundry accounts found."
      />
    );
  };
  
  export default AccountTable;
  