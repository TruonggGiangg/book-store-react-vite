import React, { useEffect, useState } from 'react';
import { Button, Col, ConfigProvider, Layout, Row, Space, theme, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
import { UpOutlined, FacebookOutlined, MessageOutlined, ArrowUpOutlined } from "@ant-design/icons";
import LayoutHeader from '@/components/layout/client/layout.header'
import { useAppProvider } from '@/components/context/app.context';
import Container from './container.layout';
import SubNav from './sub-nav.layout';
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
                <Container>

                    <div
                        style={{
                            textAlign: 'center',



                            position: 'relative',

                        }}
                    >
                        <Row gutter={[32, 24]} justify="center">
                            {/* Column 1: About Us */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Title level={4} style={{ color: isDarkTheme ? '#ffffff' : '#000000', marginBottom: '20px' }}>
                                    Về Chúng Tôi
                                </Title>
                                <Text style={{ display: 'block', lineHeight: '1.8' }}>
                                    BookStore tự hào là đơn vị cung cấp sách và dụng cụ học tập chính hãng, chất lượng cao với giá cả cạnh tranh.
                                    Chúng tôi cam kết mang đến trải nghiệm mua sắm tiện lợi với dịch vụ giao hàng nhanh chóng trên toàn quốc và
                                    nhiều ưu đãi hấp dẫn dành cho khách hàng.
                                </Text>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Title level={4} style={{ color: isDarkTheme ? '#ffffff' : '#000000', marginBottom: '20px' }}>
                                    Dịch vụ chúng tôi cung cấp
                                </Title>
                                <Space direction="vertical" size={8}>
                                    <Text>

                                        Tư vấn chọn sách

                                    </Text>
                                    <Text>

                                        Đặt hàng theo yêu cầu

                                    </Text>
                                    <Text>

                                        Dịch vụ gói quà

                                    </Text>
                                    <Text>

                                        Chương trình khách hàng thân thiết

                                    </Text>
                                    <Text>

                                        Hội thảo và sự kiện

                                    </Text>
                                </Space>
                            </Col>

                            {/* Column 3: Customer Support */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Title level={4} style={{ color: isDarkTheme ? '#ffffff' : '#000000', marginBottom: '20px' }}>
                                    Hỗ Trợ Khách Hàng
                                </Title>
                                <Space direction="vertical" size={8}>
                                    <Text>Hotline: <a href="tel:19001000" style={{ color: 'inherit' }}>1900 1000</a></Text>
                                    <Text>Email: <a href="mailto:support@bookstore.com" style={{ color: 'inherit' }}>support@bookstore.com</a></Text>
                                    <Text>Giờ làm việc: 8:00 - 22:00 (Thứ 2 - Chủ Nhật)</Text>
                                    <Text>Địa chỉ: 123 Đường Sách, Quận 1, TP. Hồ Chí Minh</Text>
                                </Space>
                            </Col>

                            {/* Column 4: Social Media */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Title level={4} style={{ color: isDarkTheme ? '#ffffff' : '#000000', marginBottom: '20px' }}>
                                    Kết Nối Với Chúng Tôi
                                </Title>
                                <Space direction="vertical" size={8}>
                                    <Text>
                                        <a href="https://facebook.com/bookstore" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                                            Facebook
                                        </a>
                                    </Text>
                                    <Text>
                                        <a href="https://instagram.com/bookstore" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                                            Instagram
                                        </a>
                                    </Text>
                                    <Text>
                                        <a href="https://twitter.com/bookstore" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                                            Twitter
                                        </a>
                                    </Text>
                                    <Text>
                                        <a href="https://youtube.com/bookstore" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                                            YouTube
                                        </a>
                                    </Text>
                                    <Text>
                                        <a href="https://tiktok.com/@bookstore" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                                            TikTok
                                        </a>
                                    </Text>
                                </Space>
                            </Col>
                        </Row>

                        {/* Copyright */}
                        <div style={{ marginTop: '40px' }} >
                            <Text style={{ color: isDarkTheme ? '#ffffff' : '#000000' }}>
                                © {new Date().getFullYear()} BookStore. Tất cả quyền được bảo lưu.
                            </Text>

                        </div>

                        {/* Scroll to Top Button */}
                        {showScroll && (
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<ArrowUpOutlined />}
                                size="large"
                                style={{
                                    position: 'fixed',
                                    bottom: 30,
                                    right: 30,
                                    background: '#ff5733',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    transition: 'transform 0.3s ease',
                                }}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            />
                        )}

                        {/* Messenger Button */}
                        <a
                            href="https://m.me/bookstore"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                position: 'fixed',
                                bottom: 30,
                                left: 30,
                                background: '#ff5733',
                                padding: '12px',
                                borderRadius: '50%',
                                color: '#fff',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <MessageOutlined style={{ fontSize: '20px' }} />
                        </a>
                    </div>
                </Container>
            </Layout>
        </ConfigProvider>
    );
};

export default AppLayoutClient;
