import CategoryAdminMain from "@/components/admin/category/main";
import BookAdminMain from "@/components/admin/product/main";
import EventAdminMain from "@/components/admin/event/main";
import PermissionAdmin from "@/components/admin/permission/main";
import ProtectedRoute from "@/components/auth/protected-route";
import AppLayout from "@/components/layout/admin/app.layout";
import AppLayoutClient from "@/components/layout/client/app.layout";
import HomePageAdmin from "@/pages/admin/home";
import UserPage from "@/pages/admin/user/user.admin";
import LoginPage from "@/pages/client/auth/login";
import RegisterPage from "@/pages/client/auth/register";
import BookDetailPage from "@/pages/client/book/book-page";
import HomePage from "@/pages/client/home";
import NotAuthorizedPage from "@/pages/results/403-page";
import NotFoundPage from "@/pages/results/404-page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayoutClient />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "book/:id", // Route động cho trang chi tiết sách
        element: <BookDetailPage />,
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
        element: <UserPage />,
      },
      {
        path: "book",
        element: <BookAdminMain />,
      },
      {
        path: "categories",
        element: <CategoryAdminMain />,
      },
      {
        path: "event",
        element: <EventAdminMain />,
      },
      {
        path: "permission",
        element: <PermissionAdmin />,
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
