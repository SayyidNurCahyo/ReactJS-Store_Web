import { createBrowserRouter } from "react-router-dom";
import Login from '../pages/authentication/Login'
import Register from '../pages/authentication/Register'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // {
  //     path: "/",
  //     element: <Layout />,
  //     children: [
  //         {
  //             index: true,
  //             element: <Dashboard />,
  //         },
  //         {
  //             path: "/customer",
  //             element: <Customer />,
  //         },
  //     ]
  // },
]);
export default router;
