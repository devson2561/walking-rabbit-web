import { createBrowserRouter, RouterProvider } from "react-router-dom";

import BackOfficeLayout from "./components/layouts/BackOfficeLayout";
import MachineLayout from "./components/layouts/MachineLayout";
import BeveragesPage from "./pages/backoffice/beverage/BeveragesPage";
import CreateBeveragePage from "./pages/backoffice/beverage/CreateBeveragePage";
import CreateMachinePage from "./pages/backoffice/machine/CreateMachinePage";
import MachinesPage from "./pages/backoffice/machine/MachinesPage";
import HomePage from "./pages/HomePage";
import ConfigOrderPage from "./pages/machine/ConfigOrderPage";
import MachineHomePage from "./pages/machine/MachineHomePage";
import MachineProductsPage from "./pages/machine/MachineProductsPage";
import MachineStocksPage from "./pages/machine/MachineStocksPage";
import OrderProcessingPage from "./pages/machine/OrderProcessingPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "machines",
      element: <MachineLayout />,
      children: [
        {
          path: ":machineId",
          element: <MachineHomePage />,
        },
        {
          path: ":machineId/stock",
          element: <MachineStocksPage />,
        },
        {
          path: ":machineId/products",
          element: <MachineProductsPage />,
        },
        {
          path: ":machineId/products/:productId",
          element: <ConfigOrderPage />,
        },
        {
          path: ":machineId/orders/:orderId/processing",
          element: <OrderProcessingPage />,
        },
      ],
    },
    {
      path: "admin",
      element: <BackOfficeLayout />,
      children: [
        {
          path: "beverages",
          children: [
            {
              path: "",
              element: <BeveragesPage />,
            },
            {
              path: "create",
              element: <CreateBeveragePage />,
            },
            {
              path: ":id/edit",
              element: <CreateBeveragePage />,
            },
          ],
        },

        {
          path: "machines",
          children: [
            {
              path: "",
              element: <MachinesPage />,
            },
            {
              path: "create",
              element: <CreateMachinePage />,
            },
            {
              path: ":id/edit",
              element: <CreateMachinePage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
