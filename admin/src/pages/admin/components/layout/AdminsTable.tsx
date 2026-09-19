import { MoreHorizontal, Trash2 } from "lucide-react";

import DataTable, {
  type TableColumn,
} from "../../../../components/layout/DataTable";

import type { Admin } from "../../../../redux/slices/adminApiSlice";

interface AdminsTableProps {
  admins: Admin[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  onDelete: (admin: Admin) => void;
}

const AdminsTable = ({ admins, isLoading, isSuperAdmin, onDelete }: AdminsTableProps) => {
  const columns: TableColumn<Admin>[] = [
    {
      key: "userName",
      header: "Admin",
      render: (admin) => (
        <div>
          <p className="font-semibold text-gray-900">{admin.userName}</p>
        </div>
      ),
    },

    {
      key: "email",
      header: "Email",
      render: (admin) => <span className="text-gray-600">{admin.email}</span>,
    },

    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (admin) => (
        <div className="flex justify-end gap-2">
          {isSuperAdmin && (<button
            type="button"
            onClick={() => onDelete(admin)}
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
            aria-label={`Delete ${admin.userName}`}
          >
            <Trash2 size={16} />
          </button>)}

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
            aria-label={`More options for ${admin.userName}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={admins}
      columns={columns}
      getRowKey={(admin) => admin.id}
      isLoading={isLoading}
      emptyMessage="No admins found."
    />
  );
};

export default AdminsTable;
