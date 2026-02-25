import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "@/pages/DashboardPage.tsx";
import OrdersPage from "@/pages/OrdersPage.tsx";

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            { path: "/", element: <DashboardPage /> },
            { path: "/orders", element: <OrdersPage /> },
        ],
    },
]);