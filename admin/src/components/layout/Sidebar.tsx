import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

import { logOut, selectUserInfo } from "../../redux/appSlice";
import { generalApiSlice } from "../../redux/apiSlice";
import type { AppDispatch, RootState } from "../../redux/store";

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
    path: "/clients",
    icon: <Users size={17} />,
  },

  {
    label: "Services",
    path: "/services",
    icon: <Shirt size={17} />,
  },

  {
    label: "Laundry Items",
    path: "/items",
    icon: <Shirt size={17} />,
  },

  {
    label: "Locations",
    path: "/locations",
    icon: <MapPin size={17} />,
  },

  {
    label: "Delivery Methods",
    path: "/delivery",
    icon: <Truck size={17} />,
  },

  {
    label: "Admins",
    path: "/admin",
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

const getInitials = (
  userName: string
): string => {
  const names = userName.trim().split(/\s+/);

  if (names.length === 0) {
    return "U";
  }

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (
    names[0].charAt(0) +
    names[names.length - 1].charAt(0)
  ).toUpperCase();
};

const formatRole = (role: string): string => {
  switch (role) {
    case "SuperAdmin":
      return "Super Admin";

    case "Admin":
      return "Admin";

    case "Client":
      return "Client";

    default:
      return role;
  }
};

const Sidebar = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  // const accessToken = useSelector(selectAccessToken);
  // const userInfo = useSelector(selectUserInfo);

  const userInfo = useSelector(
    (state: RootState) => selectUserInfo(state)
  );

  const userName = userInfo?.userName ?? "User";
  const userRole = userInfo?.role ?? "Client";
  const initials = getInitials(userName);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      dispatch(logOut());
      dispatch(generalApiSlice.util.resetApiState());
  
      navigate("/login", {
        replace: true,
      });
    }
  };
  return (
    <aside className="hidden w-64 flex-col bg-slate-950 text-white lg:flex">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Shirt size={18} />
          </div>

          <span className="font-semibold">Laundry Admin</span>
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
            {initials}
          </div>

          <div>
            <p className="text-sm font-medium">{userName}</p>

            <p className="text-xs text-gray-400">{formatRole(userRole)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
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
