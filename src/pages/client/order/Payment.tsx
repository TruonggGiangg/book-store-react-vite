import React, { useState, useEffect } from "react";
import {
  Steps,
  Card,
  Button,
  Select,
  Form,
  Radio,
  message,
  Input,
  Table,
  Typography,
  Image,
  Descriptions,
  Modal,
} from "antd";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Lottie from "lottie-react";
import { createOrderApi, getBookApi } from "@/services/api";
import Container from "@/components/layout/client/container.layout";
import CartBookList from "@/components/client/order/cart-product-list";
import loadingAnimation from "@/assets/animation/loadingAnimation.json";
import { ColumnsType } from "antd/es/table";
import { useAppProvider } from "@/components/context/app.context";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [books, setBooks] = useState<IGetBook[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCart, cart } = useAppProvider();
  const navigate = useNavigate();

  // State cho bước 2
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [district, setDistrict] = useState<string | undefined>(undefined);
  const [ward, setWard] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>("");

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalCart, setTotalCart] = useState(0);

  const columns: ColumnsType<IGetBook> = [
    {
      title: "Sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${
              record.logo
            }`}
            alt={record.title}
            width={100}
            height={100}
            style={{ borderRadius: 8, objectFit: "contain" }}
            preview
          />
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ✍️ {record.author.join(", ")}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Số lượng",
      dataIndex: "_id",
      key: "quantity",
      align: "center",
      render: (id: string) => quantities[id] || 1,
    },
    {
      title: "Thành tiền",
      dataIndex: "_id",
      key: "total",
      align: "right",
      render: (id: string, record: IGetBook) =>
        `${(record.price * (quantities[id] || 1)).toLocaleString()} VNĐ`,
    },
  ];

  // Fetch books from cart
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const cartData = JSON.parse(savedCart);

          // Tính tổng số lượng sản phẩm trong giỏ hàng
          const totalQuantity = cartData
            .map((item: { quantity: number }) => item.quantity)
            .reduce((a: number, b: number) => a + b, 0);
          setTotalCart(totalQuantity);

          // Lấy danh sách sách từ API dựa trên các ID sản phẩm trong giỏ hàng
          const bookPromises = cartData.map(
            async (item: { _id: string; quantity: number }) => {
              const res = await getBookApi(item._id);
              if (res.data) {
                return { book: res.data, quantity: item.quantity };
              }
              return null;
            }
          );

          // Chờ tất cả các sách được lấy từ API
          const booksData = await Promise.all(bookPromises);
          const validBooks = booksData.filter((book) => book !== null);
          setCartItems(validBooks);
          setBooks(validBooks.map((item) => item.book));

          // Cập nhật quantities từ cartData
          setQuantities(
            cartData.reduce((acc: { [key: string]: number }, item: any) => {
              acc[item._id] = item.quantity;
              return acc;
            }, {})
          );
        }
      } catch (error) {
        setError("Lỗi khi tải danh sách sách");
        message.error("Lỗi khi tải danh sách sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [cart]);

  // Fetch provinces from Vietnam API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/p/"
        );
        setProvinces(response.data || []);
      } catch (error) {
        message.error("Lỗi khi tải danh sách tỉnh/thành");
      }
    };
    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceCode: string) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts || []);
      setWards([]);
      setDistrict(undefined);
      setWard(undefined);
    } catch (error) {
      message.error("Lỗi khi tải danh sách quận/huyện");
      setDistricts([]);
      setWards([]);
    }
  };

  const fetchWards = async (districtCode: string) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards || []);
      setWard(undefined);
    } catch (error) {
      message.error("Lỗi khi tải danh sách phường/xã");
      setWards([]);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (bookId: string, value: number | null) => {
    if (value !== null) {
      setQuantities((prev) => ({ ...prev, [bookId]: value }));
    }

    setCartItems((prev) => {
      const updatedCart = prev.map((item) => {
        if (item.book._id === bookId) {
          return { ...item, quantity: value || 1 };
        }
        return item;
      });

      // Cập nhật localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify(
          updatedCart.map((item) => ({
            _id: item.book._id,
            quantity: item.quantity,
          }))
        )
      );

      // Cập nhật context
      setCart(
        updatedCart.map((item) => ({
          _id: item.book._id,
          quantity: item.quantity,
        }))
      );

      return updatedCart;
    });
  };

  // Handle remove book
  const handleRemoveBook = (bookId: string) => {
    setBooks((prev) => prev.filter((book) => book._id !== bookId));
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[bookId];
      return newQuantities;
    });
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item.book._id !== bookId);

      // Cập nhật localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify(
          updatedCart.map((item) => ({
            _id: item.book._id,
            quantity: item.quantity,
          }))
        )
      );

      // Cập nhật context
      setCart(
        updatedCart.map((item) => ({
          _id: item.book._id,
          quantity: item.quantity,
        }))
      );

      return updatedCart;
    });

    message.success("Đã xóa sách khỏi giỏ hàng");
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.book.price * (item.quantity || 1);
    }, 0);
  };

  // Validate Step 2
  const validateStep2 = () => {
    if (!name) {
      message.error("Vui lòng nhập họ và tên");
      return false;
    }
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      message.error("Vui lòng nhập số điện thoại hợp lệ (10 chữ số)");
      return false;
    }
    if (!province) {
      message.error("Vui lòng chọn tỉnh/thành");
      return false;
    }
    if (!district) {
      message.error("Vui lòng chọn quận/huyện");
      return false;
    }
    if (!ward) {
      message.error("Vui lòng chọn phường/xã");
      return false;
    }
    if (!address) {
      message.error("Vui lòng nhập địa chỉ chi tiết");
      return false;
    }
    return true;
  };

  // Handle form submission and order creation
  const onFinish = async () => {
    try {
      if (currentStep === 0) {
        if (cartItems.length === 0) {
          message.error("Giỏ hàng trống, vui lòng thêm sách");
          return;
        }
        setCurrentStep(1);
      } else if (currentStep === 1) {
        if (!validateStep2()) {
          return;
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        try {
          await form.validateFields(["paymentMethod"]);
          setLoading(true);

          if (!validateStep2()) {
            setLoading(false);
            return;
          }

          const provinceName =
            provinces.find((p) => String(p.code) === String(province))?.name ||
            "Chưa chọn";
          const districtName =
            districts.find((d) => String(d.code) === String(district))?.name ||
            "Chưa chọn";
          const wardName =
            wards.find((w) => String(w.code) === String(ward))?.name ||
            "Chưa chọn";

          if (
            address === "" ||
            wardName === "Chưa chọn" ||
            districtName === "Chưa chọn" ||
            provinceName === "Chưa chọn"
          ) {
            message.error(
              "Thông tin địa chỉ không hợp lệ. Vui lòng kiểm tra lại."
            );
            setLoading(false);
            return;
          }

          const orderData: ICreate垫 = {
            items: cartItems.map((item) => ({
              productId: item.book._id,
              name: item.book.title,
              author: item.book.author.join(", "),
              price: item.book.price,
              quantity: quantities[item.book._id] || 1,
            })),
            status: "pending",
            totalAmount: calculateTotal(),
            shippingAddress: `${address}, ${wardName}, ${districtName}, ${provinceName}`,
          };

          const response = await createOrderApi(orderData);
          if (response.data) {
            message.success("Đặt hàng COD thành công!");

            // Reset state
            setName("");
            setPhone("");
            setProvince(undefined);
            setDistrict(undefined);
            setWard(undefined);
            setAddress("");
            setBooks([]);
            setQuantities({});
            form.resetFields();
            setCurrentStep(0);
            setCartItems([]);
            setCart([]);
            localStorage.removeItem("cart");

            // Hiển thị modal thông báo với đếm ngược
            let seconds = 3;
            const modal = Modal.confirm({
              title: "Đặt hàng thành công!",
              content: `Đang chuyển về trang chủ sau ${seconds} giây...`,
              okText: "Về trang chủ ngay",
              onOk: () => {
                clearInterval(countdown);
                navigate("/");
              },
              okButtonProps: {
                style: {
                  backgroundColor: "#FF5733",
                  color: "#fff",
                  border: "none",
                  fontWeight: "bold",
                  padding: "0 20px",
                  borderRadius: "5px",
                  fontSize: "16px",
                },
              },
              cancelButtonProps: {
                style: { display: "none" }, // Ẩn nút "Ở lại"
              },
            });

            const countdown = setInterval(() => {
              seconds--;
              if (seconds <= 0) {
                clearInterval(countdown);
                modal.destroy();
                navigate("/");
              } else {
                modal.update({
                  content: `Đang chuyển về trang chủ sau ${seconds} giây...`,
                });
              }
            }, 1000);
          } else {
            message.error("Đặt hàng không thành công: " + response.message);
          }
        } catch (error) {
          message.error("Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin.");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      message.error("Vui lòng điền đầy đủ tất cả các thông tin bắt buộc");
    }
  };

  const steps = [
    {
      title: "Giỏ hàng",
      icon: <ShoppingCartOutlined />,
      content: loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "544px",
            borderRadius: 8,
          }}
        >
          <Lottie
            animationData={loadingAnimation}
            loop
            style={{
              width: "15%",
              maxWidth: "200px",
              height: "auto",
              margin: "auto",
            }}
          />
        </div>
      ) : error ? (
        <Card>
          <p style={{ color: "red" }}>{error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </Card>
      ) : (
        <CartBookList
          books={cartItems.map((item) => item.book)}
          quantities={cartItems.reduce((acc: Record<string, number>, item) => {
            acc[item.book._id] = item.quantity;
            return acc;
          }, {})}
          handleRemoveBook={handleRemoveBook}
          handleQuantityChange={handleQuantityChange}
          calculateTotal={calculateTotal}
        />
      ),
    },
    {
      title: "Thông tin giao hàng",
      icon: <HomeOutlined />,
      content: (
        <Card title="Địa chỉ giao hàng">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Họ và tên <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Số điện thoại <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Tỉnh/Thành <span style={{ color: "red" }}>*</span>
              </label>
              <Select
                placeholder="Chọn tỉnh/thành"
                value={province}
                onChange={(value) => {
                  setProvince(value);
                  setDistrict(undefined);
                  setWard(undefined);
                  fetchDistricts(value);
                }}
                style={{ width: "100%" }}
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={String(province.code)}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Quận/Huyện <span style={{ color: "red" }}>*</span>
              </label>
              <Select
                placeholder="Chọn quận/huyện"
                value={district}
                onChange={(value) => {
                  setDistrict(value);
                  setWard(undefined);
                  fetchWards(value);
                }}
                disabled={!province}
                style={{ width: "100%" }}
              >
                {districts.map((district) => (
                  <Option key={district.code} value={String(district.code)}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Phường/Xã <span style={{ color: "red" }}>*</span>
              </label>
              <Select
                placeholder="Chọn phường/xã"
                value={ward}
                onChange={(value) => setWard(value)}
                disabled={!district}
                style={{ width: "100%" }}
              >
                {wards.map((ward) => (
                  <Option key={ward.code} value={String(ward.code)}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Địa chỉ chi tiết <span style={{ color: "red" }}>*</span>
              </label>
              <Input.TextArea
                placeholder="Nhập địa chỉ chi tiết"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </Card>
      ),
    },
    {
      title: "Thanh toán",
      icon: <CreditCardOutlined />,
      content: (
        <Card title="Hình thức thanh toán">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="paymentMethod"
              label="Chọn phương thức thanh toán"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phương thức thanh toán",
                },
              ]}
            >
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
              >
                <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
          <Card
            title={<Title level={4}>📍 Địa chỉ giao hàng</Title>}
            style={{ marginTop: 24, borderRadius: 12 }}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Họ và tên">
                {name || "Chưa nhập"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {phone || "Chưa nhập"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {(() => {
                  const provinceName =
                    provinces.find((p) => String(p.code) === String(province))
                      ?.name || "Chưa chọn";
                  const districtName =
                    districts.find((d) => String(d.code) === Roswell uses this technique to make a significant amount of money on the stock market by buying low and selling high. He would buy stocks when they were undervalued and sell them when they reached what he believed to be their fair value. This strategy, coupled with his ability to identify promising companies early, contributed to his success.

                  return `${
                    address || "Chưa nhập"
                  }, ${wardName}, ${districtName}, ${provinceName}`;
                })()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card
            title={<Title level={4}>🧾 Hóa đơn thanh toán</Title>}
            style={{ marginTop: 24, borderRadius: 12 }}
          >
            <Table
              dataSource={cartItems.map((item) => item.book)}
              columns={columns}
              pagination={false}
              rowKey="_id"
              bordered
            />
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <Title level={4} style={{ color: "#ff4d4f" }}>
                Tổng tiền: {calculateTotal().toLocaleString()} VNĐ
              </Title>
            </div>
          </Card>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "100px" }}>
      <Container>
        <Steps current={currentStep}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          {currentStep > 0 && (
            <Button
              style={{ marginRight: 8 }}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Quay lại
            </Button>
          )}
          <Button type="primary" onClick={onFinish} loading={loading}>
            {currentStep === steps.length - 1 ? "Thanh toán" : "Tiếp tục"}
          </Button>
        </div>
        <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
      </Container>
    </div>
  );
};

export default CheckoutPage;