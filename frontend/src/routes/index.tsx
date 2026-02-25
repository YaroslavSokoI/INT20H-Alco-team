import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import DashboardPage from "@/pages/DashboardPage.tsx";
import UsersPage from "@/pages/UsersPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        ),
    },
    {
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        children: [
            { path: "/", element: <DashboardPage /> },
            { path: "/users", element: <UsersPage /> },
        ],
    },
]);