import ProtectedRoute from "@/components/auth/protected-route";
import AppLayout from "@/components/layout/app.layout";
import HomePageAdmin from "@/pages/admin/home";
import UserPage from "@/pages/admin/user/user.admin";
import LoginPage from "@/pages/client/auth/login";
import RegisterPage from "@/pages/client/auth/register";
import HomePage from "@/pages/client/home";
import NotAuthorizedPage from "@/pages/results/403-page";
import NotFoundPage from "@/pages/results/404-page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: (
                    <HomePage />
                ),
            },
            {
                path: "account",
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "about",
                element: <div>About</div>,
            },
        ],
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <HomePageAdmin />,
            },
            {
                path: "user",
                element: (
                    <ProtectedRoute>
                        <UserPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/not-authorized",
        element: <NotAuthorizedPage />,
    },
    {
        path: "*", // Xử lý trang không tồn tại
        element: <NotFoundPage />,
    },
]);
