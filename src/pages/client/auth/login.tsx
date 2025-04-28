import { useAppProvider } from "@/components/context/app.context";
import { getAccountApi, getRoleApi, loginApi } from "@/services/api";
import { Button, Checkbox, ConfigProvider, Form, FormProps, Input, message, theme } from "antd";
import Link from "antd/es/typography/Link";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const nav = useNavigate();
    const { setCurrUser, setIsAuthenticated, isLoading, setIsLoading } = useAppProvider();

    type FieldType = {
        email: string;
        password: string;
        remember?: boolean;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        const res = await loginApi(values.email, values.password);

        if (res.data) {
            localStorage.setItem('access_token', res.data.access_token);
            setIsAuthenticated(true);
            setCurrUser(res.data.user);
            nav('/');
            message.success({
                content: "Đăng nhập thành công",
            });
        } else {
            message.error({
                content: res.message || 'Lỗi server',
            });
        }
        setIsLoading(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const { isDarkTheme } = useAppProvider();

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#ff5733', // Giữ màu chính
                    colorBgLayout: isDarkTheme ? '#1a120b' : '#f9f4e8', // Nền giấy cổ hoặc gỗ tối
                    colorText: isDarkTheme ? '#f9f4e8' : '#3c2f2f', // Màu chữ
                    borderRadius: 12,
                },
            }}
        >
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDarkTheme
                        ? 'linear-gradient(135deg, #1a120b 0%, #3c2f2f 100%)'
                        : 'linear-gradient(135deg, #f9f4e8 0%, #FF7F50 100%)',

                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Họa tiết trang trí SVG (hình sách) */}
                <svg
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '5%',
                        opacity: 0.2,
                        transform: 'rotate(-15deg)',
                        animation: 'float 6s ease-in-out infinite',
                    }}
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 6H20V16H4V6ZM4 18H20V20H4V18Z"
                        stroke="#ff5733"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* SVG 2: Bút (giữ nguyên) */}
                <svg
                    style={{
                        position: 'absolute',
                        bottom: '15%',
                        right: '10%',
                        opacity: 0.2,
                        transform: 'rotate(20deg)',
                        animation: 'float 8s ease-in-out infinite',
                    }}
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 4L10 8H14L12 4ZM10 16H14L12 20L10 16Z"
                        stroke="#ff5733"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* SVG 3: Giấy cuộn */}
                <svg
                    style={{
                        position: 'absolute',
                        top: '20%',
                        right: '15%',
                        opacity: 0.15,
                        transform: 'rotate(10deg)',
                        animation: 'float 7s ease-in-out infinite',
                    }}
                    width="90"
                    height="90"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 4H18V8L14 12L18 16V20H6V4Z"
                        stroke="#ff5733"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* SVG 4: Giá sách */}
                <svg
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '8%',
                        opacity: 0.25,
                        transform: 'rotate(-10deg)',
                        animation: 'float 9s ease-in-out infinite',
                    }}
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 4H20V6H4V4ZM4 8H20V10H4V8ZM4 12H20V14H4V12ZM4 16H20V18H4V16Z"
                        stroke="#ff5733"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* SVG 5: Dấu trang sách */}
                <svg
                    style={{
                        position: 'absolute',
                        top: '30%',
                        left: '20%',
                        opacity: 0.1,
                        transform: 'rotate(25deg)',
                        animation: 'float 5s ease-in-out infinite',
                    }}
                    width="70"
                    height="70"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8 4H16V20L12 16L8 20V4Z"
                        stroke="#ff5733"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <div
                    style={{
                        borderRadius: '24px',
                        minHeight: '540px',
                        width: '460px',
                        backgroundColor: isDarkTheme ? '#2c1f14' : '#ffffff',
                        padding: '40px',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                        zIndex: 1,
                        position: 'relative',
                        overflow: 'hidden',

                        animation: 'fadeIn 0.7s ease-in-out',
                    }}
                >
                    {/* Viền trang trí bên trong */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',

                        }}
                    />
                    <Form
                        name="basic"
                        layout="vertical"
                        style={{
                            width: '100%',
                        }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div
                            style={{
                                textAlign: 'center',
                                marginBottom: '32px',
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: isDarkTheme ? '#f9f4e8' : '#3c2f2f',


                                }}
                            >
                                Nhà Sách Tri Thức
                            </h1>
                            <p
                                style={{

                                    fontStyle: 'italic',
                                    fontSize: '16px',
                                    marginTop: '8px',
                                }}
                            >
                                Mở cánh cửa đến thế giới sách
                            </p>
                        </div>

                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Vui lòng nhập email đúng định dạng' },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Nhập email của bạn"
                                style={{
                                    borderRadius: '10px',
                                    padding: '12px',

                                    transition: 'all 0.3s',
                                }}

                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Nhập mật khẩu"
                                style={{
                                    borderRadius: '10px',
                                    padding: '12px',

                                    transition: 'all 0.3s',
                                }}

                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="remember"
                            valuePropName="checked"
                            label={null}
                            style={{ marginBottom: '20px' }}
                        >
                            <Checkbox
                                style={{
                                    color: isDarkTheme ? '#f9f4e8' : '#3c2f2f',
                                    fontSize: '16px',
                                }}
                            >
                                Ghi nhớ tôi
                            </Checkbox>
                        </Form.Item>

                        <Form.Item style={{}}>
                            <Button
                                loading={isLoading}
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{
                                    width: '100%',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    padding: '10px 0',
                                    transition: 'all 0.3s',
                                    transform: 'translateY(0)',
                                    boxShadow: '0 4px 12px rgba(255, 87, 51, 0.2)',
                                }}

                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <Link
                                onClick={() => nav('/register')}
                                style={{
                                    color: '#ff5733',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    transition: 'color 0.3s',
                                }}

                            >
                                Chưa có tài khoản? Đăng ký ngay
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default LoginPage;