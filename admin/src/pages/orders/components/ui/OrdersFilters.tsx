import type { JSX } from "react";

import { Calendar, Plus, Search } from "lucide-react";

interface OrdersFiltersProps {
  search: string;

  status: string;

  onSearchChange: (value: string) => void;

  onStatusChange: (value: string) => void;

  onCreateOrder?: () => void;
}

const OrdersFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onCreateOrder,
}: OrdersFiltersProps): JSX.Element => {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* Search */}

      <div className="relative w-full lg:max-w-md">
        <Search
          size={17}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search orders..."
          className="
            h-11
            w-full
            rounded-lg
            border
            border-gray-200
            bg-white
            pl-10
            pr-4
            text-sm
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      {/* Filters */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >
        {/* Status */}

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="
            h-11
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            text-sm
            text-gray-600
            outline-none
          "
        >
          <option value="">All Status</option>

          <option value="Pending">Pending</option>

          <option value="Processing">Processing</option>

          <option value="Completed">Completed</option>

          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Date Range */}

        <button
          type="button"
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            text-sm
            text-gray-600
          "
        >
          <Calendar size={16} />
          Date Range
        </button>

        {/* New Order */}

        <button
          type="button"
          onClick={onCreateOrder}
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <Plus size={16} />
          New Order
        </button>
      </div>
    </div>
  );
};

export default OrdersFilters;
