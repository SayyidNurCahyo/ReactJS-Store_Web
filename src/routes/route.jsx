import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);
export default router;
