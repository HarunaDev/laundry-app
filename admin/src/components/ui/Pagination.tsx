import type { JSX } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pageNumber: number;

  hasNextPage: boolean;

  isLoading?: boolean;

  onPrevious: () => void;

  onNext: () => void;
}

const Pagination = ({
  pageNumber,
  hasNextPage,
  isLoading = false,
  onPrevious,
  onNext,
}: PaginationProps): JSX.Element => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-t
        border-gray-100
        px-6
        py-4
      "
    >
      <p className="text-sm text-gray-500">Page {pageNumber}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={pageNumber <= 1 || isLoading}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-md
            border
            border-gray-200
            text-gray-600
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ChevronLeft size={16} />
        </button>

        <span
          className="
            flex
            h-9
            min-w-9
            items-center
            justify-center
            rounded-md
            bg-blue-600
            px-3
            text-sm
            font-medium
            text-white
          "
        >
          {pageNumber}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNextPage || isLoading}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-md
            border
            border-gray-200
            text-gray-600
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
