import { useState } from "react";
import { useGetUsersQuery } from "../../../redux/slices/usersApiSlice";

const PAGE_SIZE = 10;

export const useClients = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetUsersQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const users = data?.data.users ?? [];

  const meta = data?.data.meta;

  const totalRecords = meta?.totalRecords ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  const hasNextPage = pageNumber < totalPages;
  const hasPreviousPage = pageNumber > 1;

  const goToNextPage = () => {
    if (hasNextPage) {
      setPageNumber((currentPage) => currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setPageNumber((currentPage) => currentPage - 1);
    }
  };

  return {
    users,

    pageNumber,
    pageSize: PAGE_SIZE,

    totalRecords,
    totalPages,

    isLoading,
    isFetching,
    isError,

    hasNextPage,
    hasPreviousPage,

    goToNextPage,
    goToPreviousPage,

    refetch,
  };
};