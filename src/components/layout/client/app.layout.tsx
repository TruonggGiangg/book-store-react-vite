import React, { useEffect, useState } from 'react';
import { Button, Col, ConfigProvider, Layout, Row, Space, theme, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
import { UpOutlined, FacebookOutlined, MessageOutlined } from "@ant-design/icons";
import LayoutHeader from '@/components/layout/client/layout.header'
import { useAppProvider } from '@/components/context/app.context';
import Container from './container.layout';
const { Content, Footer, Sider } = Layout;




const AppLayoutClient: React.FC = () => {

    const location = useLocation();
    const { isDarkTheme } = useAppProvider();
    const [collapsed, setCollapsed] = useState(false);
    const nav = useNavigate();

    const [showScroll, setShowScroll] = useState(false);

    // Xử lý hiển thị nút "Lên đầu trang"
    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);




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
                        colorBgLayout: isDarkTheme ? "#1f1f1f" : "#f5f5f5",
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
                        bodyPadding: 12,
                        borderRadius: 8,
                        boxShadow: isDarkTheme
                            ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
                            : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode

                    },


                    Table: {
                        colorBgBase: isDarkTheme ? "#141414" : "#f5f5f5",

                        boxShadow: "0x 0 10px rgba(0, 0, 0, 0.2)"

                    },
                    Upload: {

                    },

                    Skeleton: {

                    },
                    Collapse: {

                        headerBg: isDarkTheme ? "#141414" : "#fff",
                    },







                },

            }}
        >
            <Layout style={{ minHeight: "100vh" }}>

                <LayoutHeader />
                <Content>
                    {/* Nội dung chính */}
                    <Outlet />
                </Content>

                {/* Footer */}
                <Footer
                    style={{
                        textAlign: "center",
                        background: isDarkTheme ? "#1f1f1f" : "#f5f5f5",
                        color: isDarkTheme ? "#fff" : "#000",
                        position: "relative",
                    }}
                >
                    <Row gutter={[32, 16]} justify="center">
                        {/* Cột 1: Giới thiệu */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Title level={4}>📖 Về Chúng Tôi</Title>
                            <Text>
                                Chuyên cung cấp sách & dụng cụ học tập chính hãng với nhiều ưu đãi hấp dẫn.
                                Hỗ trợ giao hàng toàn quốc nhanh chóng.
                            </Text>
                        </Col>

                        {/* Cột 2: Chính sách */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Title level={4}>📜 Chính Sách</Title>
                            <Space direction="vertical">
                                <Text>🔹 Chính sách đổi trả</Text>
                                <Text>🔹 Chính sách bảo mật</Text>
                                <Text>🔹 Điều khoản sử dụng</Text>
                                <Text>🔹 Hướng dẫn mua hàng</Text>
                            </Space>
                        </Col>

                        {/* Cột 3: Hỗ trợ khách hàng */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Title level={4}>💬 Hỗ Trợ Khách Hàng</Title>
                            <Space direction="vertical">
                                <Text>📞 Hotline: 1900 1000</Text>
                                <Text>📧 Email: support@bookstore.com</Text>
                                <Text>🕒 Giờ làm việc: 8h - 22h (T2 - CN)</Text>
                            </Space>
                        </Col>

                        {/* Cột 4: Kết nối mạng xã hội */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Title level={4}>🌐 Kết Nối Với Chúng Tôi</Title>
                            <Space direction="vertical">
                                <Text>🔵 Facebook</Text>
                                <Text>📸 Instagram</Text>
                                <Text>🐦 Twitter</Text>
                                <Text>▶️ YouTube</Text>
                            </Space>
                        </Col>
                    </Row>

                    {/* Copyright */}
                    <div style={{ textAlign: "center", marginTop: "30px", fontSize: "14px" }}>
                        © {new Date().getFullYear()} BookStore. All rights reserved.
                    </div>

                    {/* Nút "Lên đầu trang" */}
                    {showScroll && (
                        <Button
                            type="primary"

                            icon={<UpOutlined />}
                            size="large"
                            style={{
                                borderRadius: "50px",
                                position: "fixed",
                                bottom: 20,
                                right: 20,
                                backgroundColor: "#FF5733",
                                border: "none",
                            }}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        />
                    )}

                    {/* Nút Messenger */}
                    <a
                        href="https://m.me/bookstore"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            position: "fixed",
                            bottom: 16,
                            left: 16,
                            background: "#FF5733",
                            padding: "12px 16px",
                            borderRadius: "50%",
                            color: "#fff",
                            fontSize: "1.6rem"

                        }}
                    >

                        <MessageOutlined />
                    </a>





                </Footer>
            </Layout>
        </ConfigProvider>
    );
};

export default AppLayoutClient;
