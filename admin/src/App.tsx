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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;