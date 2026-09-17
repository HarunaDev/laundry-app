import type { JSX } from "react";

import PageHeader from "../../components/ui/PageHeader";

import Pagination from "../../components/ui/Pagination";

import OrdersFilters from "./components/ui/OrdersFilters";

import OrdersTable from "./components/layout/OrdersTable";

import { useOrders } from "./hooks/useOrders";
import Breadcrumb from "../../components/ui/Breadcrumb";

const Orders = (): JSX.Element => {
  const {
    orders,

    status,
    search,

    pageNumber,

    isLoading,
    isFetching,
    isError,

    setStatus,
    setSearch,

    goToNextPage,
    goToPreviousPage,

    hasNextPage,
  } = useOrders();

  return (
    <div className="space-y-6">
      {/* Header */}

      <PageHeader
        title="Orders"
        breadcrumb={
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
              },
              {
                label: "Orders",
              },
            ]}
          />
        }
      />

      {/* Filters */}

      <OrdersFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCreateOrder={() => {
          console.log("Create new order");
        }}
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
          Unable to load orders. Please try again.
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
        <OrdersTable orders={orders} isLoading={isLoading || isFetching} />

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

export default Orders;
