import { NavLink } from "react-router-dom";
import { Home, Shield, Sword, Settings } from "lucide-react";
import type { JSX } from "react";
import type { NavItem } from "../../types/navigation";
// import homeIcon from "../../assets/img/odyssey-icon.png";

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { label: "Orders", path: "/orders", icon: <Sword size={18} /> },
  { label: "A", path: "/armory", icon: <Shield size={18} /> },
  { label: "S", path: "/settings", icon: <Settings size={18} /> },
];

const Sidebar = (): JSX.Element => {
  return (
    <aside className="w-20 lg:w-52 bg-sidebar flex flex-col py-4">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="mb-8 w-full flex flex-col lg:justify-start px-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg lg:hidden"
              style={{
                background: "linear-gradient(180deg, #AA8AFF, #81ECFF)",
              }}
            >
              <img
                src={""}
                alt="Home"
                className="w-5 h-5 object-contain"
              />
            </div>

            <h1 className="hidden lg:block text-lg mt-2 font-semibold tracking-wide text-accent">
              Laundry App
            </h1>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-4 w-full">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
            w-full h-12 flex items-center justify-center lg:justify-start gap-4 px-4
            transition-all duration-300
            ${
              isActive
                ? "text-accent border-r-2 border-accent shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                : "text-gray-400 hover:text-white"
            }
          `
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background:
                          "linear-gradient(to right, #7C3AED33, #06B6D433)",
                      }
                    : undefined
                }
              >
                {item.icon}

                {/* TEXT (hidden on small screens) */}
                <span className="hidden lg:inline text-lg">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col gap-3 px-0 lg:px-4">
          {/* Help */}
          <button className="w-full h-12 flex items-center justify-center lg:justify-start gap-3 text-gray-400 hover:text-white transition">
            <div className="w-5 h-5 mr-2 ml-1 flex items-center justify-center rounded-full border border-gray-500">
              ?
            </div>
            <span className="hidden lg:inline text-sm">Help</span>
          </button>

          {/* Logout */}
          <button className="w-full h-12 flex items-center justify-center lg:justify-start gap-3 text-gray-400 hover:text-red-400 transition">
            <div className="w-8 h-3 flex items-center justify-center">⎋</div>
            <span className="hidden lg:inline text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;