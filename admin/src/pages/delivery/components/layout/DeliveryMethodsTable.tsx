import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import DataTable, {
  type TableColumn,
} from "../../../../components/layout/DataTable";

import type { DeliveryMethod } from "../../../../redux/slices/deliveryApiSlice";

interface DeliveryMethodsTableProps {
  deliveryMethods: DeliveryMethod[];
  isLoading: boolean;
  onEdit: (method: DeliveryMethod) => void;
  onDelete: (method: DeliveryMethod) => void;
}

const DeliveryMethodsTable = ({
  deliveryMethods,
  isLoading,
  onEdit,
  onDelete,
}: DeliveryMethodsTableProps) => {
  const columns: TableColumn<DeliveryMethod>[] = [
    {
      key: "name",
      header: "Delivery Method",
      render: (method) => (
        <div>
          <p className="font-semibold text-gray-900">{method.name}</p>
        </div>
      ),
    },

    {
      key: "description",
      header: "Description",
      render: (method) => (
        <p className="max-w-md truncate text-gray-600">
          {method.description || "No description"}
        </p>
      ),
    },

    {
      key: "price",
      header: "Price",
      render: (method) => (
        <span className="font-medium text-gray-900">
          ₦{method.price.toLocaleString()}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",
      render: (method) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            method.isActive
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {method.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (method) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(method)}
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
            aria-label={`Edit ${method.name}`}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(method)}
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
            aria-label={`Delete ${method.name}`}
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
            aria-label={`More options for ${method.name}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={deliveryMethods}
      columns={columns}
      getRowKey={(method) => method.id}
      isLoading={isLoading}
      emptyMessage="No delivery methods found."
    />
  );
};

export default DeliveryMethodsTable;
