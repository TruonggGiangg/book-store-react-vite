import React, { useState } from 'react';
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
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';


import LayoutHeader from '@/components/layout/client/layout.header'
import { useAppProvider } from '@/components/context/app.context';
const { Content, Footer, Sider } = Layout;




const AppLayoutClient: React.FC = () => {

    const location = useLocation();
    const { isDarkTheme } = useAppProvider();
    const [collapsed, setCollapsed] = useState(false);
    const nav = useNavigate();





    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#ff5733", // Màu chính
                    colorBgLayout: isDarkTheme ? "#141414" : "#f5f5f5", // Màu nền layout
                    colorText: isDarkTheme ? "#f5f5f5" : "#333", // Màu chữ
                    fontSize: 14,
                    size: 20
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
                        colorBorder: isDarkTheme ? "#333" : "#dedede"
                    },
                    Card: {
                        colorBorder: isDarkTheme ? "#333" : "#dedede",
                    },


                    Table: {
                        colorBgBase: isDarkTheme ? "#141414" : "#f5f5f5",

                        boxShadow: "0x 0 10px rgba(0, 0, 0, 0.2)"

                    },
                    Upload: {

                    }


                },

            }}
        >
            <Layout style={{ minHeight: '100vh' }}>

                <LayoutHeader />
                <Content style={{}}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>

            </Layout>
        </ConfigProvider>
    );
};

export default AppLayoutClient;
