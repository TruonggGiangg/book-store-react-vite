import { registerApi } from "@/services/api";
import { Button, Form, FormProps, Input, message } from "antd";
import { useNavigate } from "react-router-dom";


const onFinish: FormProps<IInputRegister>['onFinish'] = async (values) => {

    const nav = useNavigate();
    const res = await registerApi(values);
    if (res.data) {
        nav('/login')
        message.success({
            content: "Đăng nhập thành công"
        })
    } else {
        message.error({
            content: res.message
        })
    }
};

const onFinishFailed: FormProps<IInputRegister>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

console.log(import.meta.env.VITE_BACKEND_URL)

const RegisterPage = () => {
    return (
        <>
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
                                Đăng ký
                            </h1>
                        </div>

                        <Form.Item<IInputRegister>
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<IInputRegister>
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<IInputRegister>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<IInputRegister>
                            label="Gender"
                            name="gender"
                            rules={[{ required: true, message: 'Please input your password rely!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<IInputRegister>
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: "email", message: 'Not a format email' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<IInputRegister>
                            label="Age"
                            name="age"
                            rules={[
                                { required: true, message: 'Please input your age!' },


                            ]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item<IInputRegister>
                            label="Address"
                            name="address"
                            rules={[
                                { required: true, message: 'Please input your address!' },

                            ]}
                        >
                            <Input />
                        </Form.Item>


                        {/* <Form.Item<IInputRegister> name="remember" valuePropName="checked" label={null}>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item> */}

                        <Form.Item label={null} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default RegisterPage;