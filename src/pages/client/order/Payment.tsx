import React, { useState, useEffect, useRef } from "react";
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
  Grid,
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
import successAnimation from "@/assets/animation/successAnimation.json";
import { ColumnsType } from "antd/es/table";
import { useAppProvider } from "@/components/context/app.context";
import { useNavigate } from "react-router-dom";
import img404 from "@/assets/img/book-with-broken-pages.gif";
import AppBreadcrumb from "@/components/nav/AppBreadcrumb";

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
  const { setCart, cart, currUser, isDarkTheme } = useAppProvider();
  const navigate = useNavigate();

  const screens = Grid.useBreakpoint();

  // State cho bước 2
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [district, setDistrict] = useState<string | undefined>(undefined);
  const [ward, setWard] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>("");

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalCart, setTotalCart] = useState(0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null; // Ngăn lỗi lặp vô hạn
    e.currentTarget.src = img404; // Thay bằng ảnh mặc định
  };

  const minimumDisplayTimeRef = useRef(false); // Theo dõi thời gian tối thiểu 4 giây

  const columns: ColumnsType<IGetBook> = [
    {
      title: "Sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${record.logo
              }`}
            alt={record.title}
            width={100}
            height={100}
            style={{ borderRadius: 8, objectFit: "contain" }}
            preview
            onError={(e) => {
              e.currentTarget.src = img404; // Dùng ảnh lỗi khi ảnh không thể tải
            }}
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
      if (!currUser?._id) return;

      try {
        setLoading(true);
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          const userCart: { _id: string; quantity: number }[] =
            cartData[currUser._id] || [];

          // Tính tổng số lượng sản phẩm
          const totalQuantity = userCart.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
          );
          setTotalCart(totalQuantity);

          // Gọi API để lấy thông tin từng sách
          const bookPromises = userCart.map(async (item) => {
            const res = await getBookApi(item._id);
            if (res.data) {
              return { book: res.data, quantity: item.quantity };
            }
            return null;
          });

          const booksData = await Promise.all(bookPromises);
          const validBooks = booksData.filter((book) => book !== null);

          setCartItems(validBooks);
          setBooks(validBooks.map((item) => item.book));
          setQuantities(
            userCart.reduce((acc: { [key: string]: number }, item) => {
              acc[item._id] = item.quantity;
              return acc;
            }, {})
          );
        } else {
          setCartItems([]);
          setBooks([]);
          setQuantities({});
          setTotalCart(0);
        }
      } catch (error) {
        setError("Lỗi khi tải danh sách sách");
        message.error("Lỗi khi tải danh sách sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currUser]);

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
  const handleQuantityChange = async (bookId: string, value: number | null) => {
    if (!currUser?._id || value === null) return;

    const userID = currUser._id;

    try {
      const bookItem = await getBookApi(bookId);
      const stock = bookItem.data?.stock || 0;

      let finalValue = value;

      if (value > stock) {
        message.warning(
          `Số lượng vượt quá tồn kho. Chỉ còn lại ${stock} sản phẩm.`
        );
        finalValue = stock; // Set lại giá trị hợp lệ
      }

      // Cập nhật số lượng
      setQuantities((prev) => ({ ...prev, [bookId]: finalValue }));

      setCartItems((prev) => {
        const updatedCart = prev.map((item) => {
          if (item.book._id === bookId) {
            return { ...item, quantity: finalValue };
          }
          return item;
        });

        // Lấy giỏ hàng hiện tại từ localStorage
        const storedCart = localStorage.getItem("cart");
        const cartObject: {
          [key: string]: { _id: string; quantity: number }[];
        } = storedCart ? JSON.parse(storedCart) : {};

        // Cập nhật giỏ hàng của user hiện tại
        cartObject[userID] = updatedCart.map((item) => ({
          _id: item.book._id,
          quantity: item.quantity,
        }));

        // Ghi lại vào localStorage
        localStorage.setItem("cart", JSON.stringify(cartObject));

        // Cập nhật context
        setCart(cartObject[userID]);

        return updatedCart;
      });
    } catch (error) {
      message.error("Lỗi khi cập nhật số lượng sản phẩm");
    }
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
          // lướt lên đầu trang
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (currentStep === 1) {
        if (!validateStep2()) {
          return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
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

          const orderData: ICreateOrder = {
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
            numberPhone: phone,
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
            if (currUser?._id) {
              const userID = currUser._id;
              const storedCart = localStorage.getItem("cart");
              if (storedCart) {
                const cartObject = JSON.parse(storedCart);
                delete cartObject[userID]; // Xóa giỏ hàng của user hiện tại
                localStorage.setItem("cart", JSON.stringify(cartObject));
              }
            }
            setCart([]);

            // Đặt thời gian tối thiểu 4 giây
            setTimeout(() => {
              minimumDisplayTimeRef.current = true; // Đánh dấu đã đủ 4 giây
            }, 4000);
            let seconds = 10;

            const modal = Modal.success({
              title: "Đặt hàng thành công!",
              content: (
                <div
                  style={{
                    color: isDarkTheme ? "#fff" : "#000",
                    textAlign: "center",
                  }}
                >
                  <Lottie
                    animationData={successAnimation}
                    loop
                    style={{
                      width: "40%",
                      maxWidth: "200px",
                      height: "auto",
                      margin: "auto",
                    }}
                  />
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      color: isDarkTheme ? "#ccc" : "#333",
                    }}
                    id="countdown-text"
                  >
                    Bạn có thể theo dõi đơn hàng của mình trong trang lịch sử mua hàng.
                    {` Đang chuyển về trang chủ sau ${seconds} giây.`}
                  </Text>
                </div>
              ),
              okText: "Về trang chủ ngay",
              onOk: () => {
                if (!minimumDisplayTimeRef.current) {
                  message.info("Vui lòng đợi ít nhất 4 giây!");
                  return;
                }
                clearInterval(countdown);
                modal.destroy();
                navigate("/");
                if (currUser?._id) {
                  const userID = currUser._id;
                  const storedCart = localStorage.getItem("cart");
                  if (storedCart) {
                    const cartObject = JSON.parse(storedCart);
                    delete cartObject[userID];
                    localStorage.setItem("cart", JSON.stringify(cartObject));
                  }
                }
                setCart([]);
              },
              okButtonProps: {
                disabled: !minimumDisplayTimeRef.current,
                style: {
                  backgroundColor: minimumDisplayTimeRef.current
                    ? "#FF5733"
                    : isDarkTheme
                      ? "#444"
                      : "#d9d9d9",
                  color: minimumDisplayTimeRef.current ? "#fff" : isDarkTheme ? "#aaa" : "#000",
                  border: "none",
                  fontWeight: "bold",
                  padding: "0 20px",
                  borderRadius: "5px",
                  fontSize: "16px",
                },
              },
              cancelButtonProps: {
                style: { display: "none" },
              },
              centered: true,
              // Tuỳ chọn theme nâng cao nếu cần
              className: isDarkTheme ? "custom-modal-dark" : "custom-modal-light",
            });

            // Cập nhật trạng thái nút sau 4 giây
            setTimeout(() => {
              modal.update({
                okButtonProps: {
                  disabled: false,
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
              });
            }, 4000);

            // Đếm ngược thời gian
            const countdown = setInterval(() => {
              seconds--;
              if (seconds <= 0) {
                clearInterval(countdown);
                modal.destroy();
                navigate("/");
                if (currUser?._id) {
                  const userID = currUser._id;
                  const storedCart = localStorage.getItem("cart");
                  if (storedCart) {
                    const cartObject = JSON.parse(storedCart);
                    delete cartObject[userID]; // Xóa giỏ hàng của user hiện tại
                    localStorage.setItem("cart", JSON.stringify(cartObject));
                  }
                }
                setCart([]);
              } else {
                // Chỉ cập nhật text đếm ngược
                const countdownText = document.getElementById("countdown-text");
                if (countdownText) {
                  countdownText.textContent = `Đang chuyển về trang chủ sau ${seconds} giây...`;
                }
              }
            }, 1000);

            // Cleanup khi component unmount
            return () => {
              clearInterval(countdown);
              modal.destroy();
            };
          } else {
            message.error("Đặt hàng không thành công: " + response.message);
          }
        } catch (error) {
          message.error(
            "Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin."
          );
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
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
          </Card>

          <Card
            title={<Title level={4}>📍 Địa chỉ giao hàng</Title>}
            style={{ borderRadius: 12 }}
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
                    districts.find((d) => String(d.code) === String(district))
                      ?.name || "Chưa chọn";
                  const wardName =
                    wards.find((w) => String(w.code) === String(ward))?.name ||
                    "Chưa chọn";

                  return `${address || "Chưa nhập"}, ${wardName}, ${districtName}, ${provinceName}`;
                })()}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title={<Title level={4}>🧾 Hóa đơn thanh toán</Title>}
            style={{ borderRadius: 12 }}
          >
            <Table
              dataSource={cartItems.map((item) => item.book)}
              columns={columns}
              pagination={false}
              rowKey="_id"
              bordered
              scroll={{ x: 768 }}
            />
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <Title level={4} style={{ color: "#ff4d4f" }}>
                Tổng tiền: {calculateTotal().toLocaleString()} VNĐ
              </Title>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div style={{ marginTop: "172px" }}>
      <Container>
        <AppBreadcrumb />
        <Steps current={currentStep}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>
        <div
          style={
            screens.lg
              ? { marginTop: 24, textAlign: "right" }
              : {
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: "32px",
                zIndex: 1000,


              }
          }
        >
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
