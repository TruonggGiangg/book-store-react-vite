import { useAppProvider } from "../../context/app.context";
import { Button, Badge, Popover, InputNumber, Tooltip, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getBookApi } from "@/services/api";
const { Text, Title } = Typography;
// Định nghĩa kiểu ICart và IGetBook
interface ICart {
  book: IGetBook;
  quantity: number;
}

const Cart = () => {
  const { cart } = useAppProvider();
  const [totalCart, setTotalCart] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]); // Sử dụng `any` để không ép kiểu

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart); // `cartData` vẫn giữ cấu trúc ban đầu

        // Tính tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = cartData
          .map((item: { quantity: number }) => item.quantity)
          .reduce((a: number, b: number) => a + b, 0);
        setTotalCart(totalQuantity);

        // Lấy danh sách sách từ API dựa trên các ID sản phẩm trong giỏ hàng
        const fetchBooks = async () => {
          try {
            const bookPromises = cartData.map(
              async (item: { _id: string; quantity: number }) => {
                const res = await getBookApi(item._id); // Lấy sách theo _id
                if (res.data) {
                  return { book: res.data, quantity: item.quantity }; // Thêm quantity vào dữ liệu sách
                }
                return null;
              }
            );

            // Chờ tất cả các sách được lấy từ API
            const booksData = await Promise.all(bookPromises);
            // Cập nhật giỏ hàng với sách và số lượng
            setCartItems(booksData.filter((book) => book !== null)); // Cập nhật giỏ hàng
          } catch (error) {
            console.error("Error fetching books:", error);
          }
        };

        fetchBooks();
      } catch (error) {
        console.error("Error parsing cart items:", error);
      }
    }
  }, [cart]);

  const title = <h2>Giỏ hàng</h2>;
  const renderCartHTML = () => {
    if (cartItems.length === 0) {
      return <p>Giỏ hàng của bạn hiện đang trống.</p>;
    }

    return (
      <>
        <div style={{ maxHeight: "400px", overflowY: "auto", width: "600px" }}>
          {cartItems.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                display: "flex",
                gap: "30px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${
                    item.book.logo
                  }`}
                  alt={item.book.title}
                  style={{ width: "70px", height: "70px" }}
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
                        whiteSpace: "nowrap", // Ngăn không cho văn bản xuống dòng
                        overflow: "hidden", // Ẩn phần văn bản bị tràn
                        textOverflow: "ellipsis", // Thêm dấu ba chấm khi văn bản bị tràn
                        maxWidth: "300px", // Giới hạn độ rộng
                      }}
                    >
                      {item.book.title}
                    </span>
                  </Tooltip>
                  <Text
                    type="secondary"
                    style={{
                      fontWeight: "normal",
                      whiteSpace: "nowrap", // Ngăn không cho văn bản xuống dòng
                      overflow: "hidden", // Ẩn phần văn bản bị tràn
                      textOverflow: "ellipsis", // Thêm dấu ba chấm khi văn bản bị tràn
                      maxWidth: "300px", // Giới hạn độ rộng
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
                {/* {item.quantity} */}
                <InputNumber
                  defaultValue={item.quantity}
                  min={1}
                  disabled
                ></InputNumber>
              </div>
            </div>
          ))}
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={() => {
              window.location.href = "/payment";
            }}
          >
            Thanh toán
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
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
          trigger="click"
          title={title}
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
    </>
  );
};

export default Cart;
