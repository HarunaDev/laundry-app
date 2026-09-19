import './App.css';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { Login } from './pages/auth';
import Home from "./pages/home/Home";
import Orders from './pages/orders/Orders';
import Client from './pages/client/Client';
import Locations from './pages/locations/Location';
import Services from './pages/services/Services';
import Items from './pages/items/Items';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Home />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "clients",
        element: <Client />,
      },
      {
        path: "locations",
        element: <Locations />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "items",
        element: <Items />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;