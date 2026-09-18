import {
    MoreHorizontal,
    Pencil,
    Trash2,
  } from "lucide-react";
  
  import DataTable, {
    type TableColumn,
  } from "../../../../components/layout/DataTable";
  
  import type {
    LaundryService,
  } from "../../../../redux/slices/servicesApiSlice";
  
  interface ServicesTableProps {
    services: LaundryService[];
    isLoading: boolean;
    onEdit: (service: LaundryService) => void;
    onDelete: (service: LaundryService) => void;
  }
  
  const ServicesTable = ({
    services,
    isLoading,
    onEdit,
    onDelete,
  }: ServicesTableProps) => {
    const columns: TableColumn<LaundryService>[] = [
      {
        key: "name",
        header: "Service",
        render: (service) => (
          <div>
            <p className="font-semibold text-gray-900">
              {service.name}
            </p>
          </div>
        ),
      },
  
      {
        key: "description",
        header: "Description",
        render: (service) => (
          <p className="max-w-md truncate text-gray-600">
            {service.description || "No description"}
          </p>
        ),
      },
  
      {
        key: "status",
        header: "Status",
        render: (service) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              service.isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {service.isActive
              ? "Active"
              : "Inactive"}
          </span>
        ),
      },
  
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        render: (service) => (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onEdit(service)}
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
              aria-label={`Edit ${service.name}`}
            >
              <Pencil size={16} />
            </button>
  
            <button
              type="button"
              onClick={() => onDelete(service)}
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
              aria-label={`Delete ${service.name}`}
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
              aria-label={`More options for ${service.name}`}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ),
      },
    ];
  
    return (
      <DataTable
        data={services}
        columns={columns}
        getRowKey={(service) => service.id}
        isLoading={isLoading}
        emptyMessage="No laundry services found."
      />
    );
  };
  
  export default ServicesTable;