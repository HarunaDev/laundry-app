import type { JSX } from "react";

import PageHeader from "../../components/ui/PageHeader";
import Pagination from "../../components/ui/Pagination";
import Breadcrumb from "../../components/ui/Breadcrumb";

import ClientsTable from "./components/layout/ClientsTable";
import { useClients } from "./hooks/useClients";

const Client = (): JSX.Element => {
  const {
    users,
    pageNumber,
    isLoading,
    isFetching,
    isError,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
  } = useClients();

  return (
    <div className="space-y-6">
      {/* Header */}

      <PageHeader
        title="Clients"
        breadcrumb={
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
              },
              {
                label: "Clients",
              },
            ]}
          />
        }
      />

      {/* Error */}

      {isError && (
        <div
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-600
          "
        >
          Unable to load clients. Please try again.
        </div>
      )}

      {/* Table Card */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-100
          bg-white
          shadow-sm
        "
      >
        <ClientsTable
          users={users}
          isLoading={isLoading || isFetching}
        />

        <Pagination
          pageNumber={pageNumber}
          hasNextPage={hasNextPage}
          isLoading={isFetching}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      </div>
    </div>
  );
};

export default Client;