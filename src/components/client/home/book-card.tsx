import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Badge,
  Tooltip,
  Typography,
  Space,
  Rate,
  InputNumber,
  Button,
  Tag,
  notification,
} from "antd";
import {
  ShoppingCartOutlined,
  TagOutlined,
  HeartOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import { useAppProvider } from "@/components/context/app.context";
import TagScroller from "./tag-list";
import img404 from "@/assets/img/book-with-broken-pages.gif";
import { getBookApi } from "@/services/api";

interface BookCardProps {
  book: IGetBook;
  gridSizes: {
    xxl: number;
    xl: number;
    lg: number;
    md: number;
    sm: number;
    xs: number;
  };
  listCategories: IGetCategories[];
  isBook?: boolean;
  showRibbon?: boolean;
  ribbonText?: string;
  ribbonColor?: string;
}

const BookCard: FC<BookCardProps> = ({
  book,
  gridSizes,
  listCategories,
  isBook = false,
  showRibbon = false,
  ribbonText,
  ribbonColor,
}) => {
  const { isDarkTheme, setCart, currUser } = useAppProvider();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Tạo Tag từ ID
  const renderTag = (id: string) => {
    const category = listCategories.find((x) => x._id === id);
    return category ? (
      <Tag color="volcano" key={category._id}>
        {category.name}
      </Tag>
    ) : null;
  };

  // Logic thêm sản phẩm vào giỏ hàng
  const addCart = async (id: string, quantity: number) => {
    if (!currUser?._id) {
      notification.error({
        message: "Thao tác thất bại",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
        placement: "topRight",
      });
      return;
    }

    const userID = currUser._id;
    const storedCart = localStorage.getItem("cart");
    let cartObject = storedCart ? JSON.parse(storedCart) : {};

    // Nếu chưa có giỏ hàng cho user hiện tại, khởi tạo mảng rỗng
    if (!cartObject[userID]) {
      cartObject[userID] = [];
    }

    const userCart = cartObject[userID];
    const existingItemIndex = userCart.findIndex(
      (item: { _id: string }) => item._id === id
    );
    const bookSearch = await getBookApi(id);
    const stock = bookSearch.data?.stock || 0;
    if (stock < quantity) {
      notification.error({
        message: "Thao tác thất bại",
        description: "Số lượng sản phẩm không đủ trong kho.",
        placement: "topRight",
      });
      return;
    }
    if (existingItemIndex !== -1) {
      userCart[existingItemIndex].quantity += quantity;
    } else {
      userCart.push({ _id: id, quantity });
    }

    cartObject[userID] = userCart;
    localStorage.setItem("cart", JSON.stringify(cartObject));
    setCart(userCart); // Cập nhật state theo cart của user hiện tại
  };

  // Tính ribbonText và ribbonColor động
  const getRibbonInfo = () => {
    if (ribbonText && ribbonColor) {
      return { text: ribbonText, color: ribbonColor };
    }
    const now = new Date();
    const createdAt = book.createdAt ? new Date(book.createdAt) : null;
    const daysSinceCreated = createdAt
      ? (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    if (book.sold >= 1000) {
      return { text: "Bán chạy", color: "orange" };
    } else if (daysSinceCreated <= 30) {
      return { text: "NEW", color: "blue" };
    } else {
      return { text: "HOT", color: "red" };
    }
  };

  // Xử lý lỗi tải ảnh
  const [imgSrc, setImgSrc] = useState(
    `${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`
  );
  const handleImageError = () => {
    setImgSrc(img404);
  };

  // Xử lý nhấp chuột để điều hướng
  const handleCardClick = useCallback(() => {
    navigate(`/book/${book._id}`);
  }, [navigate, book._id]);

  const { text: dynamicRibbonText, color: dynamicRibbonColor } =
    getRibbonInfo();

  const CardContent = (
    <div onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <Card
        style={{
          borderRadius: "8px",
          padding: "10px",
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out",
          boxShadow: isDarkTheme
            ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
            : "0px 0px 12px rgba(0, 0, 0, 0.1)",
        }}
        cover={
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: "12px",
            }}
          >
            <img
              alt={book.title}
              src={imgSrc}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.5s ease",
              }}
              onError={handleImageError}
            />
          </div>
        }
      >
        <Card.Meta
          title={
            <Tooltip title={book.title}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {book.title}
              </Typography.Title>
            </Tooltip>
          }
          description={
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {isBook && (
                <div onClick={(e) => e.stopPropagation()}>
                  <TagScroller
                    tags={book.attributes?.classification || []}
                    renderTag={renderTag}
                  />
                </div>
              )}

              <Tooltip title={book.author.join(", ")}>
                <Space>
                  <UserOutlined style={{ color: "#FF5733" }} />
                  <Typography.Paragraph
                    style={{ margin: 0 }}
                    ellipsis={{ rows: 1 }}
                  >
                    {book.author.join(", ")}
                  </Typography.Paragraph>
                </Space>
              </Tooltip>

              <Space>
                <ShoppingCartOutlined style={{ color: "#FF5733" }} />
                <Typography.Paragraph style={{ margin: 0 }}>
                  Đã bán: {book.sold ?? 0}
                </Typography.Paragraph>
              </Space>
              {/* <Space>
                <CalendarOutlined style={{ color: "#FF5733" }} />
                <Typography.Paragraph style={{ margin: 0 }}>
                  {new Date(book.createdAt || "").toLocaleDateString()}
                </Typography.Paragraph>
              </Space> */}

              <Space>
                <TagOutlined style={{ color: "#FF5733" }} />
                <Typography.Paragraph
                  strong
                  style={{ color: "#FF5733", fontSize: "16px", margin: 0 }}
                >
                  {book.price.toLocaleString()} VNĐ
                </Typography.Paragraph>
              </Space>

              <Space align="center" size="small">
                <HeartOutlined style={{ color: "#FF5733" }} />
                {book.rating === 0 ? (
                  <Typography.Paragraph style={{ margin: 0 }}>
                    Chưa có đánh giá
                  </Typography.Paragraph>
                ) : (
                  <Rate disabled value={book.rating || 0} allowHalf />
                )}
              </Space>

              <Space
                align="center"
                style={{ display: "flex" }}
                onClick={(e) => e.stopPropagation()}
              >
                <InputNumber
                  min={1}
                  defaultValue={1}
                  size="small"
                  style={{ padding: "6px", width: "100%" }}
                  onChange={(value) => {
                    if (value) setQuantity(value);
                  }}
                />
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  style={{
                    background: "#FF5733",
                    borderColor: "#FF5733",
                    flex: 2,
                  }}
                  onClick={() => addCart(book._id, quantity)}
                >
                  Add to cart
                </Button>
              </Space>
            </div>
          }
        />
      </Card>
    </div>
  );

  return (
    <Col
      key={book._id}
      {...gridSizes}
      style={{ transition: "transform 0.3s ease-in-out" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {showRibbon ? (
        <Badge.Ribbon text={dynamicRibbonText} color={dynamicRibbonColor}>
          {CardContent}
        </Badge.Ribbon>
      ) : (
        CardContent
      )}
    </Col>
  );
};

export default BookCard;
