import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import Customer from '../pages/customer/Customer'
import CustomerList from "../pages/customer/components/CustomerList";
import CustomerForm from "../pages/customer/components/CustomerForm";

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
      {
        path: 'customer',
        element: <Customer/>,
        children: [
            {
                index: true,
                element: <CustomerList/>
            },
            {
                path: 'update/:id',
                element: <CustomerForm/>
            }
        ]
      }
    ],
  },
]);
export default router;
