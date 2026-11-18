
import { useMemo, useState } from "react";

import { useGetPaymentsQuery } from "../../../redux/slices/paymentApiSlice";

import type {
  PaymentFilters,
  PaymentMethod,
  PaymentStatus,
} from "../../../types/payments";

const DEFAULT_PAGE_SIZE = 10;

export const usePayments = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [paymentStatus, setPaymentStatus] = useState<
    PaymentStatus | ""
  >("");

  const [paymentMethod, setPaymentMethod] = useState<
    PaymentMethod | ""
  >("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const filters = useMemo<PaymentFilters>(
    () => ({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...(paymentStatus && { PaymentStatus: paymentStatus }),
      ...(paymentMethod && { PaymentMethod: paymentMethod }),
      ...(fromDate && { FromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { ToDate: new Date(toDate).toISOString() }),
    }),
    [
      pageNumber,
      pageSize,
      paymentStatus,
      paymentMethod,
      fromDate,
      toDate,
    ],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPaymentsQuery(filters);

  const payments = data?.data?.items ?? [];

  const searchValue = search.trim().toLowerCase();

  const filteredPayments = payments.filter((payment) => {
    if (!searchValue) return true;

    return (
      payment.id.toString().includes(searchValue) ||
      payment.laundryOrderId.toString().includes(searchValue)
    );
  });

  const totalRecords = data?.data?.totalRecords ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const resetPage = () => setPageNumber(1);

  const handleStatusChange = (value: PaymentStatus | "") => {
    setPaymentStatus(value);
    resetPage();
  };

  const handleMethodChange = (value: PaymentMethod | "") => {
    setPaymentMethod(value);
    resetPage();
  };

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    resetPage();
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((previousPage) => previousPage - 1);
    }
  };

  const goToNextPage = () => {
    if (payments.length === pageSize) {
      setPageNumber((previousPage) => previousPage + 1);
    }
  };

  const clearFilters = () => {
    setPaymentStatus("");
    setPaymentMethod("");
    setFromDate("");
    setToDate("");
    setSearch("");
    setPageNumber(1);
  };

  return {
    payments: filteredPayments,
    paymentStatus,
    paymentMethod,
    fromDate,
    toDate,
    search,
    pageNumber,
    pageSize,
    totalRecords,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage: pageNumber < totalPages,
    hasPreviousPage: pageNumber > 1,
    setPaymentStatus: handleStatusChange,
    setPaymentMethod: handleMethodChange,
    setFromDate: handleFromDateChange,
    setToDate: handleToDateChange,
    setSearch: handleSearchChange,
    goToNextPage,
    goToPreviousPage,
    clearFilters,
    refetch,
  };
};
