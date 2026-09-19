import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import DataTable, {
  type TableColumn,
} from "../../../../components/layout/DataTable";

import type { LaundryItem } from "../../../../redux/slices/itemsApiSlice";

interface ItemsTableProps {
  items: LaundryItem[];
  isLoading: boolean;
  onEdit: (item: LaundryItem) => void;
  onDelete: (item: LaundryItem) => void;
}

const ItemsTable = ({
  items,
  isLoading,
  onEdit,
  onDelete,
}: ItemsTableProps) => {
  const columns: TableColumn<LaundryItem>[] = [
    {
      key: "name",
      header: "Item",
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{item.name}</p>
        </div>
      ),
    },

    {
      key: "price",
      header: "Price",
      render: (item) => (
        <span className="font-medium text-gray-900">
          ₦{item.price.toLocaleString()}
        </span>
      ),
    },

    {
      key: "service",
      header: "Service",
      render: (item) => (
        <span className="text-gray-600">{item.laundryServiceName}</span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
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
            aria-label={`Edit ${item.name}`}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
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
            aria-label={`Delete ${item.name}`}
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
            aria-label={`More options for ${item.name}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      getRowKey={(item) => item.id}
      isLoading={isLoading}
      emptyMessage="No laundry items found."
    />
  );
};

export default ItemsTable;
