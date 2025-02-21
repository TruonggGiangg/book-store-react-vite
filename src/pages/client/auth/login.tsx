import { useAppProvider } from "@/components/context/app.context";
import { getAccountApi, getRoleApi, loginApi } from "@/services/api";
import { Button, Checkbox, ConfigProvider, Form, FormProps, Input, message, theme } from "antd";
import Link from "antd/es/typography/Link";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {

    const nav = useNavigate();

    const { setCurrUser, setIsAuthenticated, isLoading, setIsLoading } = useAppProvider()

    type FieldType = {
        email: string;
        password: string;
        remember?: boolean
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        const res = await loginApi(values.email, values.password);

        if (res.data) {
            localStorage.setItem('access_token', res.data.access_token);
            // await setLoginSuccess(); // 🔥 Đợi cập nhật Context trước khi chuyển trang
            setIsAuthenticated(true);
            setCurrUser(res.data.user)
            nav('/'); // 🔥 Chuyển trang sau khi cập nhật Context
            message.success({
                content: "Đăng nhập thành công"
            });

        } else {
            message.error({
                content: res.message || 'Lỗi server'
            });
        }
        setIsLoading(false)
    };


    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    console.log(import.meta.env.VITE_BACKEND_URL)
    const { isDarkTheme } = useAppProvider();
    return (
        <>
            <ConfigProvider
                theme={{
                    algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#ff5733', // Màu chính (Cam đỏ)
                        colorBgLayout: isDarkTheme ? '#001529' : '#f5f5f5', // Màu nền layout
                        colorText: isDarkTheme ? '#f5f5f5' : '#333333', // Màu chữ
                    },
                }}>
                <div style={{
                    background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        borderRadius: '40px',
                        minHeight: '500px',
                        minWidth: '600px',
                        backgroundColor: '#fff',
                        padding: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Form
                            name="basic"
                            layout="vertical"
                            style={{
                                width: '100%'
                            }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <div style={{
                                display: 'flex',
                                margin: '12px 0',
                                justifyContent: 'center'
                            }}>
                                <h1>
                                    Đăng nhập
                                </h1>
                            </div>

                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your username!' },
                                    { type: "email", message: "Vui lòng nhập email đúng định dạng" }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>



                            <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item label={null} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button loading={isLoading} type="primary" htmlType="submit">
                                    Đăng nhập
                                </Button>

                            </Form.Item>
                            <Link onClick={() => { nav('/register') }}> Bạn chưa có tài khoản? Đăng ký ngay</Link>
                        </Form>
                    </div>
                </div>
            </ConfigProvider>

        </>
    )
}

export default LoginPage;