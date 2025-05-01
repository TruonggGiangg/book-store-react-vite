// src/components/common/AppBreadcrumb.tsx
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const breadcrumbNameMap: Record<string, string> = {
    "books": "Sách",
    "book": "Chi tiết sách",
    "tools": "Dụng cụ",
    "order": "Đơn hàng",
    "payment": "Thanh toán",
    "history": "Lịch sử mua hàng",
    "account": "Tài khoản",
    "about": "Giới thiệu",
    "admin": "Quản trị",
    "user": "Người dùng",
    "categories": "Danh mục",
    "event": "Sự kiện",
    "permission": "Phân quyền",
};

export default function AppBreadcrumb() {
    const location = useLocation();

    const pathSnippets = location.pathname.split("/").filter(i => i);

    const extraBreadcrumbItems = pathSnippets
        .map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
            const key = pathSnippets[index];

            // Kiểm tra ID
            const isId = /^\d+$/.test(key) || /^[0-9a-fA-F]{24,}$/.test(key);
            if (isId) return null;

            return {
                key: url,
                title: <Link to={url}>{breadcrumbNameMap[key] || key}</Link>,
            };
        })
        .filter(
            (item): item is { key: string; title: JSX.Element } =>
                item !== null && item.title !== undefined
        );


    const breadcrumbItems = [
        {
            title: <Link to="/"><HomeOutlined /></Link>,
            key: "home",
        },
        ...extraBreadcrumbItems,
    ];

    return <Breadcrumb items={breadcrumbItems} style={{ marginBottom: "16px" }} />;
}
