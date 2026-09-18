import {
    MoreHorizontal,
    Pencil,
    Trash2,
  } from "lucide-react";
  
  import DataTable, {
    type TableColumn,
  } from "../../../../components/layout/DataTable";
  
  import type {
    LaundryLocation,
  } from "../../../../redux/slices/laundryLocationsApiSlice";
  
  interface LocationsTableProps {
    locations: LaundryLocation[];
    isLoading: boolean;
    onEdit: (location: LaundryLocation) => void;
    onDelete: (location: LaundryLocation) => void;
  }
  
  const LocationsTable = ({
    locations,
    isLoading,
    onEdit,
    onDelete,
  }: LocationsTableProps) => {
    const columns: TableColumn<LaundryLocation>[] = [
      {
        key: "name",
        header: "Location",
        render: (location) => (
          <div>
            <p className="font-semibold text-gray-900">
              {location.name}
            </p>
  
            <p className="mt-1 text-xs text-gray-500">
              {location.city}, {location.state}
            </p>
          </div>
        ),
      },
  
      {
        key: "address",
        header: "Address",
        render: (location) => (
          <p className="max-w-xs">
            {location.address}
          </p>
        ),
      },
  
      {
        key: "landmark",
        header: "Landmark",
        render: (location) => (
          <span>
            {location.landmark || "Not provided"}
          </span>
        ),
      },
  
      {
        key: "phoneNumber",
        header: "Phone",
        render: (location) => (
          <span>
            {location.phoneNumber || "Not provided"}
          </span>
        ),
      },
  
      {
        key: "status",
        header: "Status",
        render: (location) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              location.isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {location.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
  
      {
        key: "actions",
        header: "Actions",
        render: (location) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(location)}
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
              aria-label={`Edit ${location.name}`}
            >
              <Pencil size={16} />
            </button>
  
            <button
              type="button"
              onClick={() => onDelete(location)}
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
              aria-label={`Delete ${location.name}`}
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
                transition-colors
                hover:bg-gray-100
                hover:text-gray-700
              "
              aria-label="More options"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ),
      },
    ];
  
    return (
      <DataTable
        data={locations}
        columns={columns}
        getRowKey={(location) => location.id}
        isLoading={isLoading}
        emptyMessage="No laundry locations found."
      />
    );
  };
  
  export default LocationsTable;