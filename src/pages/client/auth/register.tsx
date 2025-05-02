import { useAppProvider } from "@/components/context/app.context";
import { registerApi } from "@/services/api";
import {
  Button,
  ConfigProvider,
  Form,
  FormProps,
  Input,
  message,
  Select,
  theme,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the interface for form inputs

const RegisterPage = () => {
  const navigate = useNavigate(); // Move useNavigate to top level

  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  // Form submission handler
  const onFinish: FormProps<IInputRegister>["onFinish"] = async (values) => {
    setIsLoading(true); // Set loading state to true
    try {
      const res = await registerApi(values);
      if (res.data) {
        navigate("/login");
        message.success({
          content: "Đăng ký thành công",
        });
      } else {
        message.error({
          content: res.message,
        });
      }
    } catch (error) {
      message.error({
        content: "Đã xảy ra lỗi trong quá trình đăng ký",
      });
    }
    setIsLoading(false); // Reset loading state
  };

  // Form submission failure handler
  const onFinishFailed: FormProps<IInputRegister>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const { isDarkTheme } = useAppProvider();

  // Log environment variable (for debugging, remove in production)
  console.log(import.meta.env.VITE_BACKEND_URL);

  return (
    <>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(10deg); }
            50% { transform: translateY(-20px) rotate(15deg); }
            100% { transform: translateY(0px) rotate(10deg); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <ConfigProvider
        theme={{
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#ff5733", // Giữ màu chính
            colorBgLayout: isDarkTheme ? "#1a120b" : "#f9f4e8", // Nền giấy cổ hoặc gỗ tối
            colorText: isDarkTheme ? "#f9f4e8" : "#3c2f2f", // Màu chữ
            borderRadius: 12,
          },
        }}
      >
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDarkTheme
              ? "linear-gradient(135deg, #1a120b 0%, #3c2f2f 100%)"
              : "linear-gradient(135deg, #f9f4e8 0%, #FF7F50 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* SVG Decorations */}
          <svg
            style={{
              position: "absolute",
              top: "10%",
              left: "5%",
              opacity: 0.2,
              transform: "rotate(-15deg)",
              animation: "float 6s ease-in-out infinite",
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

          <svg
            style={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              opacity: 0.2,
              transform: "rotate(20deg)",
              animation: "float 8s ease-in-out infinite",
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

          <svg
            style={{
              position: "absolute",
              top: "20%",
              right: "15%",
              opacity: 0.15,
              transform: "rotate(10deg)",
              animation: "float 7s ease-in-out infinite",
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

          <svg
            style={{
              position: "absolute",
              bottom: "10%",
              left: "8%",
              opacity: 0.25,
              transform: "rotate(-10deg)",
              animation: "float 9s ease-in-out infinite",
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

          <svg
            style={{
              position: "absolute",
              top: "30%",
              left: "20%",
              opacity: 0.1,
              transform: "rotate(25deg)",
              animation: "float 5s ease-in-out infinite",
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
              borderRadius: "24px",
              minHeight: "540px",
              width: "min(460px, 90vw)", // Responsive width
              backgroundColor: isDarkTheme ? "#2c1f14" : "#ffffff",
              padding: "40px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
              zIndex: 1,
              position: "relative",
              overflow: "hidden",
              animation: "fadeIn 0.7s ease-in-out",
            }}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: "100%" }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <div
                style={{
                  display: "flex",
                  margin: "12px 0",
                  justifyContent: "center",
                }}
              >
                <h1>Đăng ký</h1>
              </div>

              <Form.Item<IInputRegister>
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>

              <Form.Item<IInputRegister>
                label="Name"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>

              <Form.Item<IInputRegister>
                label="Password"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item<IInputRegister>
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]} // Ensures this field depends on password field
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Mật khẩu không khớp!");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>

              <Form.Item<IInputRegister>
                label="Gender"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  options={[
                    { value: "male", label: "Nam" },
                    { value: "female", label: "Nữ" },
                    { value: "other", label: "Khác" },
                  ]}
                />
              </Form.Item>

              <Form.Item<IInputRegister>
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item<IInputRegister>
                label="Age"
                name="age"
                rules={[
                  { required: true, message: "Vui lòng nhập tuổi!" },
                  { pattern: /^[0-9]+$/, message: "Tuổi phải là một số!" },
                  {
                    validator: (_, value) =>
                      value && (parseInt(value) < 1 || parseInt(value) > 120)
                        ? Promise.reject("Tuổi phải từ 1 đến 120!")
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input placeholder="Nhập tuổi" />
              </Form.Item>

              <Form.Item<IInputRegister>
                label="Address"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>

              <Form.Item
                //no label for the last item
                wrapperCol={{ offset: 3, span: 18 }} // Align with label column
                style={{ marginTop: "24px" }} // Add margin to the top
                // style={{ textAlign: 'center' }}
              >
                <Button
                  loading={isLoading}
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    padding: "10px 0",
                    transition: "all 0.3s",
                    transform: "translateY(0)",
                    boxShadow: "0 4px 12px rgba(255, 87, 51, 0.2)",
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <div
                onClick={() => navigate("/login")}
                style={{
                  color: "#ff5733",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "color 0.3s",
                  cursor: "pointer",
                }}
              >
                Đã có tài khoản? Đăng nhập ngay
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default RegisterPage;
