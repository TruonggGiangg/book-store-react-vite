import React, { useState } from "react";
import {
  BookOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FileOutlined,
  KeyOutlined,
  LockOutlined,
  PieChartOutlined,
  ProductOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
  TableOutlined,
  OrderedListOutlined,
  RedditCircleFilled,
  FileDoneOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import logo_light from "@/assets/logo/light-logo.png";
import logo_dark from "@/assets/logo/dark-logo.png";
import LayoutHeader from "./layout.header";
import { useAppProvider } from "@/components/context/app.context";
const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: () => void,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    onClick,
    label,
  } as MenuItem;
}

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { isDarkTheme } = useAppProvider();
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();

  const items: MenuItem[] = [
    getItem("Tổng quan", "1", <PieChartOutlined />, () => {
      nav("/admin");
    }),
    getItem("Sản phẩm", "2", <WalletOutlined />, () => {
      nav("/admin/book");
    }),
    getItem("Người dùng", "3", <UserOutlined />, () => {
      nav("/admin/user");
    }),
    getItem("Danh mục", "4", <DatabaseOutlined />, () => {
      nav("/admin/categories");
    }),
    getItem("Vai trò", "5", <LockOutlined />, () => {
      nav("/admin/role");
    }),
    getItem("Phân quyền", "6", <KeyOutlined />, () => {
      nav("/admin/permission");
    }),
    getItem("Sự kiện", "7", <TableOutlined />, () => {
      nav("/admin/event");
    }),
    getItem("Đơn hàng", "8", <FileDoneOutlined />, () => {
      nav("/admin/order");
    }),
  ];

  const menuKeyMap: Record<string, string> = {
    "/admin": "1",
    "/admin/book": "2",
    "/admin/user": "3",
    "/admin/categories": "4",
    "/admin/role": "5",
    "/admin/permission": "6",
    "/admin/event": "7",
    "/admin/order": "8",
  };

  const selectedKey = menuKeyMap[location.pathname] || "1";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#ff5733", // Màu chính
          colorBgLayout: isDarkTheme ? "#141414" : "#f5f5f5", // Màu nền layout
          colorText: isDarkTheme ? "#f5f5f5" : "#333", // Màu chữ
          fontSize: 14,
        },
        components: {
          Layout: {
            headerBg: isDarkTheme ? "#141414" : "#f5f5f5", // Màu nền header
            headerColor: isDarkTheme ? "#f5f5f5" : "#333333", // Màu chữ header
            footerBg: isDarkTheme ? "#141414" : "#f5f5f5",
            colorBgLayout: isDarkTheme ? "#141414" : "#f5f5f5",
            siderBg: isDarkTheme ? "#141414" : "#f5f5f5",
            triggerBg: isDarkTheme ? "#ff5733" : "#ff5733",
            triggerColor: isDarkTheme ? "#f5f5f5" : "#f5f5f5",
            boxShadow: "none",
          },
          Menu: {
            itemBg: isDarkTheme ? "#141414" : "#f5f5f5",
            colorBorder: "transparent",
          },

          Input: {
            colorBorder: isDarkTheme ? "#333" : "#dedede",
          },
          Card: {
            colorBorder: isDarkTheme ? "#333" : "#dedede",
          },

          Table: {
            colorBgBase: isDarkTheme ? "#141414" : "#f5f5f5",

            boxShadow: "0x 0 10px rgba(0, 0, 0, 0.2)",
          },
          Upload: {},
          Typography: {
            margin: 0,
            titleMarginBottom: 0,
            titleMarginTop: 0,
          },
          Tag: {},
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", position: "relative" }}>
        <Sider
          style={{
            boxShadow: "8px 2px 8px rgba(0, 0, 0, 0.1)",
            borderRight: isDarkTheme
              ? "1px solid #141414"
              : "1px solid #dedede",
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Link
            to={"/"}
            style={{
              display: "flex",
              width: "100%",
              height: "64px",
              padding: "12px 0",
            }}
          >
            <img
              src={isDarkTheme ? logo_dark : logo_light}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Link>

          <Menu
            style={{
              borderInlineEnd: "none",
            }}
            selectedKeys={[selectedKey]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <LayoutHeader />
          <Content style={{ padding: "16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            BookStore Design ©{new Date().getFullYear()} Created by BookStoreMember
          </Footer>
        </Layout>

        {/* <div style={{ position: "absolute", bottom: 12, right: 12, zIndex: 999 }}>
                        Mess
                    </div> */}
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
