import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Shirt,
  MapPin,
  Truck,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import type { JSX } from "react";
import type { NavItem } from "../../types/navigation";

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={17} />,
  },

  {
    label: "Orders",
    path: "/orders",
    icon: <ClipboardList size={17} />,
  },

  {
    label: "Customers",
    path: "/customers",
    icon: <Users size={17} />,
  },

  {
    label: "Services",
    path: "/services",
    icon: <Shirt size={17} />,
  },

  {
    label: "Laundry Items",
    path: "/laundry-items",
    icon: <Shirt size={17} />,
  },

  {
    label: "Locations",
    path: "/locations",
    icon: <MapPin size={17} />,
  },

  {
    label: "Delivery Methods",
    path: "/delivery-methods",
    icon: <Truck size={17} />,
  },

  {
    label: "Users",
    path: "/users",
    icon: <UserCog size={17} />,
  },

  {
    label: "Reports",
    path: "/reports",
    icon: <BarChart3 size={17} />,
  },

  {
    label: "Settings",
    path: "/settings",
    icon: <Settings size={17} />,
  },
];

const Sidebar = (): JSX.Element => {
  return (
    <aside className="hidden w-64 flex-col bg-slate-950 text-white lg:flex">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Shirt size={18} />
          </div>

          <span className="font-semibold">
            Laundry Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center gap-3 rounded-lg px-3 py-3
              text-sm transition-colors
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }
              `
            }
          >
            {item.icon}

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700">
            J
          </div>

          <div>
            <p className="text-sm font-medium">
              John Admin
            </p>

            <p className="text-xs text-gray-400">
              Super Admin
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={17} />

          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;