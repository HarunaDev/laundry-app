import type { JSX } from "react";

import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

const TopBar = (): JSX.Element => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <button
        type="button"
        className="text-gray-500 lg:hidden"
      >
        <Menu size={22} />
      </button>

      <div className="hidden flex-1 justify-center md:flex">
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search orders, customers..."
            className="
              w-full rounded-lg border border-gray-200
              py-2 pl-9 pr-4 text-sm
              outline-none
              focus:border-blue-500
            "
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="relative text-gray-500"
        >
          <Bell size={19} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
          J
        </div>
      </div>
    </header>
  );
};

export default TopBar;