import { useState } from "react";

import { Plus } from "lucide-react";

import AdminsTable from "./components/layout/AdminsTable";
import AdminModal from "./components/ui/AdminModal";
import { useAdmins } from "./hooks/useAdmins";

import type {
  Admin,
  CreateAdminRequest,
} from "../../redux/slices/adminApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const Admins = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const userInfo = useSelector((state: RootState) => state.app.userInfo);

  const isSuperAdmin = userInfo?.role === "SuperAdmin";

  const {
    admins,
    totalRecords,
    totalPages,
    isLoading,
    isFetching,
    isCreating,
    isDeleting,
    createAdminAccount,
    deleteAdminAccount,
  } = useAdmins({
    pageNumber,
    pageSize,
  });

  const handleCreateAdmin = async (
    admin: CreateAdminRequest
  ): Promise<void> => {
    try {
      await createAdminAccount(admin);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create admin:", error);
    }
  };

  const handleDeleteAdmin = async (): Promise<void> => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteError(null);

      await deleteAdminAccount(deleteTarget.id);

      setDeleteTarget(null);

      /*
       * If the deleted admin was the only record
       * on the current page, move back one page.
       */
      if (admins.length === 1 && pageNumber > 1) {
        setPageNumber((currentPage) => currentPage - 1);
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);

      setDeleteError("Failed to delete admin. Please try again.");
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((currentPage) => currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber((currentPage) => currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admins</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage administrator accounts.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-gray-900
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-gray-800
            "
          >
            <Plus size={18} />
            Add Admin
          </button>
        )}
      </div>

      {/* Admin Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <AdminsTable
          admins={admins}
          isLoading={isLoading || isFetching}
          isSuperAdmin={isSuperAdmin}
          onDelete={setDeleteTarget}
        />

        {/* Pagination */}
        {!isLoading && totalRecords > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-500">
              Showing page{" "}
              <span className="font-medium text-gray-700">{pageNumber}</span> of{" "}
              <span className="font-medium text-gray-700">{totalPages}</span> (
              {totalRecords} {totalRecords === 1 ? "admin" : "admins"})
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={pageNumber === 1 || isFetching}
                className="
                    rounded-lg
                    border
                    border-gray-200
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
              >
                Previous
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={pageNumber >= totalPages || isFetching}
                className="
                    rounded-lg
                    border
                    border-gray-200
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        isSubmitting={isCreating}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAdmin}
      />

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Admin
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-700">
                  {deleteTarget.userName}
                </span>
                ? This action cannot be undone.
              </p>

              {deleteError && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {deleteError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteTarget(null);
                    setDeleteError(null);
                  }}
                  disabled={isDeleting}
                  className="
                      rounded-lg
                      border
                      border-gray-200
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAdmin}
                  disabled={isDeleting}
                  className="
                      rounded-lg
                      bg-red-600
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-red-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                >
                  {isDeleting ? "Deleting..." : "Delete Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
