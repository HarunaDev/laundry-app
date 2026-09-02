import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import type { JSX } from "react";

const DashboardLayout = (): JSX.Element => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-20 flex-shrink-0">
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;