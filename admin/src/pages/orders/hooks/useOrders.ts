import { useState } from "react";

import { useFilterOrdersQuery } from "../../../redux/slices/ordersApiSlice";

const DEFAULT_PAGE_SIZE = 10;

export const useOrders = () => {
  const [status, setStatus] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, isError, error, refetch } = useFilterOrdersQuery({
    status,
    pageNumber,
    pageSize,
  });

  const orders = Array.isArray(data?.items) ? data.items : [];

  const searchValue = search.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    if (!searchValue) {
      return true;
    }

    return (
      order.customerName.toLowerCase().includes(searchValue) ||
      order.id.toString().includes(searchValue)
    );
  });

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPageNumber(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const goToNextPage = () => {
    // if (orders.length === pageSize) {
    //   setPageNumber(
    //     (previousPage) =>
    //       previousPage + 1
    //   );
    // }
    if (data?.meta && pageNumber < data.meta.totalPages) {
      setPageNumber((previousPage) => previousPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((previousPage) => previousPage - 1);
    }
  };

  return {
    orders: filteredOrders,

    status,
    search,

    pageNumber,
    pageSize,

    totalRecords: data?.meta?.totalRecords ?? 0,
    totalPages: data?.meta?.totalPages ?? 1,

    isLoading,
    isFetching,
    isError,
    error,

    setStatus: handleStatusChange,

    setSearch: handleSearchChange,

    goToNextPage,

    goToPreviousPage,

    hasNextPage:
      // orders.length === pageSize,
      data?.meta ? pageNumber < data.meta.totalPages : false,

    hasPreviousPage: pageNumber > 1,

    refetch,
  };
};
