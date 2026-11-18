
import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Pagination from "../../components/ui/Pagination";

import PaymentsTable from "./components/layout/PaymentsTable";
import { usePayments } from "./hooks/usePayments";

const Payments = () => {
  const {
    payments,
    paymentStatus,
    paymentMethod,
    fromDate,
    toDate,
    search,
    pageNumber,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    setPaymentStatus,
    setPaymentMethod,
    setFromDate,
    setToDate,
    setSearch,
    goToNextPage,
    goToPreviousPage,
    clearFilters,
  } = usePayments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="View and manage customer payments."
        breadcrumb={
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Payments" },
            ]}
          />
        }
      />

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            Filter Payments
          </h2>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div>
            <label
              htmlFor="payment-search"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Search
            </label>

            <input
              id="payment-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Payment ID or Order ID"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Payment status */}
          <div>
            <label
              htmlFor="payment-status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Payment Status
            </label>

            <select
              id="payment-status"
              value={paymentStatus}
              onChange={(event) =>
                setPaymentStatus(
                  event.target.value as typeof paymentStatus,
                )
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Payment method */}
          <div>
            <label
              htmlFor="payment-method"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>

            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value as typeof paymentMethod,
                )
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">All methods</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          {/* From date */}
          <div>
            <label
              htmlFor="from-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              From Date
            </label>

            <input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* To date */}
          <div>
            <label
              htmlFor="to-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              To Date
            </label>

            <input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              min={fromDate || undefined}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Payment Records
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review payment transactions and receipt submissions.
          </p>
        </div>

        {isError ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            Unable to load payments. Please try again.
          </div>
        ) : (
          <>
            <PaymentsTable
              payments={payments}
              isLoading={isLoading}
            />

            <div className="mt-4">
              <Pagination
                pageNumber={pageNumber}
                hasNextPage={hasNextPage}
                isLoading={isFetching}
                onPrevious={goToPreviousPage}
                onNext={goToNextPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payments;
