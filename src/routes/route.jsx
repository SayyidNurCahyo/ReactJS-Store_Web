import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../layout/Layout";
// import Dashboard from "../pages/dashboard/Dashboard";
import Customer from "../pages/customer/Customer";
import CustomerList from "../pages/customer/components/CustomerList";
import CustomerForm from "../pages/customer/components/CustomerForm";
import Menu from "../pages/menu/Menu";
import MenuList from "../pages/menu/components/MenuList";
import MenuForm from "../pages/menu/components/MenuForm";
import Table from "../pages/table/Table";
import TableList from "../pages/table/components/TableList";
import TableForm from "../pages/table/components/TableForm";
import ErrorBoundary from "../shared/Error/ErrorBoundary";
import Error404 from "../shared/Error/Error404";
import Transaction from "../pages/transaction/Transaction";
import AddTransaction from "../pages/transaction/AddTransaction";

const router = createBrowserRouter([
  {
    path: "*",
    element: <Error404 />,
  },
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
      <ErrorBoundary>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <AddTransaction />,
      },
      {
        path: "customer",
        element: <Customer />,
        children: [
          {
            index: true,
            element: <CustomerList />,
          },
          {
            path: "update/:id",
            element: <CustomerForm />,
          },
        ],
      },
      {
        path: "menu",
        element: <Menu />,
        children: [
          {
            index: true,
            element: <MenuList />,
          },
          {
            path: "new",
            element: <MenuForm />,
          },
          {
            path: "update/:id",
            element: <MenuForm />,
          },
        ],
      },
      {
        path: "table",
        element: <Table />,
        children: [
          {
            index: true,
            element: <TableList />,
          },
          {
            path: "new",
            element: <TableForm />,
          },
          {
            path: "update/:id",
            element: <TableForm />,
          },
        ],
      },
      {
        path: "transaction",
        element: <Transaction />,
      },
    ],
  },
]);
export default router;
