import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppProvider } from '../context/app.context';
import logo_light from '@/assets/logo/light-logo.png';
import logo_dark from '@/assets/logo/dark-logo.png';
import LayoutHeader from './layout.header';
const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    onClick?: () => void,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        onClick,
        label

    } as MenuItem;
}



const AppLayout: React.FC = () => {
    const { isDarkTheme } = useAppProvider();
    const [collapsed, setCollapsed] = useState(false);
    const nav = useNavigate();

    const items: MenuItem[] = [
        getItem('Dashboard', '1', <PieChartOutlined />, () => { nav('/admin') }),
        getItem('Book', '2', <DesktopOutlined />),
        getItem('Users', 'sub1', <UserOutlined />, () => { nav('/admin/user') }),
    ];
    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#ff5733", // Màu chính
                    colorBgLayout: isDarkTheme ? "#141414" : "#f5f5f5", // Màu nền layout
                    colorText: isDarkTheme ? "#f5f5f5" : "#333", // Màu chữ
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

                        boxShadow: "none"

                    },
                    Menu: {
                        itemBg: isDarkTheme ? "#141414" : "#f5f5f5"
                    },
                    Input: {
                        colorBorder: isDarkTheme ? "#333" : "#dedede"
                    }

                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    style={{ boxShadow: "8px 2px 8px rgba(0, 0, 0, 0.1)" }}

                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <div style={{
                        display: "flex",
                        width: "100%",
                        height: "64px",
                        padding: "12px 0"
                    }}>
                        <img src={isDarkTheme ? logo_dark : logo_light} style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain"
                        }} />
                    </div>

                    <Menu

                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <LayoutHeader />
                    <Content style={{ padding: '16px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AppLayout;
