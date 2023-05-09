import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import BackOfficeLayout from "./components/layouts/BackOfficeLayout";
import MachineLayout from "./components/layouts/MachineLayout";
import BeveragesPage from "./pages/backoffice/beverage/BeveragesPage";
import CreateBeveragePage from "./pages/backoffice/beverage/CreateBeveragePage";
import HomePage from "./pages/HomePage";
import MachineHomePage from "./pages/machine/MachineHomePage";
import MachinesPage from "./pages/backoffice/machine/MachinesPage";
import CreateMachinePage from "./pages/backoffice/machine/CreateMachinePage";

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
          path: ":id",
          element: <MachineHomePage />,
        },
      ],
    },
    {
      path: "admin",
      element: <BackOfficeLayout />,
      children: [
        {
          path: "beverages",
          element: <BeveragesPage />,
        },
        {
          path: "beverages/create",
          element: <CreateBeveragePage />,
        },
        {
          path: "machines",
          element: <MachinesPage />,
        },
        {
          path: "machines/create",
          element: <CreateMachinePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
