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
import BookDetailPage from "@/pages/client/book/book-detail";
import BookPage from "@/pages/client/book/books-page";

import NotAuthorizedPage from "@/pages/results/403-page";
import NotFoundPage from "@/pages/results/404-page";
import { createBrowserRouter } from "react-router-dom";
import OrderPage from "@/pages/client/order/OrderPage";
import CheckoutPage from "@/pages/client/order/Payment";
import HistoryPage from "@/pages/client/history/history-page";
import ToolPage from "@/pages/client/book/tool-page";
import HomePage from "@/pages/client/home";
import OrderAdminMain from "@/components/admin/order/main";
import Account from "@/pages/client/account/Account";
import RoleAdmin from "@/components/admin/role/main";
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
        path: "books",
        element: <BookPage />,
      },
      {
        path: "tools",
        element: <ToolPage />,
      },
      {
        path: "books/:id",
        element: <BookPage />,
      },
      {
        path: "book/:id",
        element: <BookDetailPage />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "payment",
        element: <CheckoutPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <Account />
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
      {
        path: "order",
        element: <OrderAdminMain />,
      },
      {
        path: "role",
        element: <RoleAdmin />,
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
    path: "*",
    element: <NotFoundPage />,
  },
]);
