import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
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
