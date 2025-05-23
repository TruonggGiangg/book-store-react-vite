import { useAppProvider } from "../../context/app.context";
import { Button, Badge, Popover, InputNumber, Tooltip, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getBookApi } from "@/services/api";
const { Text } = Typography;
import img404 from "@/assets/img/book-with-broken-pages.gif";
import { useNavigate } from "react-router-dom";

import { Grid } from "antd";
const { useBreakpoint } = Grid;

const Cart = () => {
  const { cart, currUser } = useAppProvider();
  const [totalCart, setTotalCart] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]); // Sử dụng `any` để không ép kiểu
  const nav = useNavigate(); // Lấy hàm điều hướng từ context
  const [popoverOpen, setPopoverOpen] = useState(false);
  const screens = useBreakpoint();
  // Xử lý lỗi tải ảnh
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null; // Ngăn lỗi lặp vô hạn
    e.currentTarget.src = img404; // Thay bằng ảnh mặc định
  };



  const handleCheckout = () => {
    setPopoverOpen(false); // Đóng popover
    nav("/payment"); // Điều hướng đến trang thanh toán
  };

  // Đồng bộ giỏ hàng khi cart thay đổi
  useEffect(() => {
    if (currUser == null) return;

    const userID = currUser._id;
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);

        const userCart: { _id: string; quantity: number }[] =
          cartData[userID] || [];

        // Tính tổng số lượng sản phẩm trong giỏ hàng của user
        const totalQuantity = userCart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setTotalCart(totalQuantity);

        // Lấy danh sách sách từ API
        const fetchBooks = async () => {
          try {
            const bookPromises = userCart.map(async (item) => {
              const res = await getBookApi(item._id);
              if (res.data) {
                return { book: res.data, quantity: item.quantity };
              }
              return null;
            });

            const booksData = await Promise.all(bookPromises);
            setCartItems(booksData.filter((book) => book !== null));
          } catch (error) {
            console.error("Error fetching books:", error);
            setCartItems([]);
          }
        };

        fetchBooks();
      } catch (error) {
        console.error("Error parsing cart items:", error);
        setTotalCart(0);
        setCartItems([]);
      }
    } else {
      // Xử lý khi không có dữ liệu cart
      setTotalCart(0);
      setCartItems([]);
    }
  }, [cart, currUser]);

  const title = <h2>Giỏ hàng</h2>;
  const renderCartHTML = () => {
    if (currUser == null) {
      return <p>Vui lòng đăng nhập để xem giỏ hàng.</p>;
    }
    if (cartItems.length === 0) {
      return <p>Giỏ hàng của bạn hiện đang trống.</p>;
    }

    return (
      <div
        style={{
          margin: "0 10px",
          maxHeight: "400px",
          overflowY: "auto",
          width: screens.lg ? "600px" : "90vw", // responsive width
          padding: screens.lg ? "0" : "8px",
        }}
      >
        {cartItems.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              display: "flex",
              gap: "30px",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap", // tránh vỡ layout
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item.book.logo
                  }`}
                alt={item.book.title}
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "contain",
                  aspectRatio: "2 / 3",
                }}
                loading="lazy"
                onError={handleImageError}
              />
              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Tooltip title={item.book.title}>
                  <span
                    style={{
                      fontSize: 17,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "300px",
                    }}
                  >
                    {item.book.title}
                  </span>
                </Tooltip>
                <Text
                  type="secondary"
                  style={{
                    fontWeight: "normal",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "300px",
                  }}
                >
                  Tác giả: {item.book.author.join(", ")}
                </Text>
                <span style={{ fontSize: 16 }}>
                  {item.book.price.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
            <div>
              <span>Số lượng: </span>
              <InputNumber value={item.quantity} min={1} disabled />
            </div>
          </div>
        ))}
        <Button
          type="primary"
          style={{ width: "100%" }}
          onClick={handleCheckout}
        >
          Thanh toán
        </Button>
      </div>
    );
  };

  return (
    <span
      style={{
        cursor: "pointer",
        alignItems: "center",
        display: "flex",
        alignSelf: "center",
      }}
    >
      <Popover
        placement="bottom"
        content={renderCartHTML()}
        title={title}
        trigger="click"
        open={popoverOpen}
        onOpenChange={(newOpen) => setPopoverOpen(newOpen)}
      >
        <Badge
          count={totalCart}
          size="small"
          offset={[0, 0]}
          overflowCount={99}
        >
          <ShoppingCartOutlined style={{ fontSize: "30px" }} />
        </Badge>
      </Popover>
    </span>
  );
};

export default Cart;
