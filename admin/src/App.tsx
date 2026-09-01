import './App.css';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { Login } from './pages/auth';

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
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <div>Dashboard Content</div>,
      },
      {
        path: "/orders",
        element: <div>Quest Content</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;