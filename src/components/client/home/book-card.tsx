import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, Col, Badge, Tooltip, Typography, Space,
    Rate, InputNumber, Button, Tag
} from "antd";
import {
    ShoppingCartOutlined, TagOutlined, HeartOutlined,
    UserOutlined, CalendarOutlined
} from "@ant-design/icons";
import { useAppProvider } from "@/components/context/app.context";
import TagScroller from "./tag-list";

interface BookCardProps {
    book: IGetBook;
    gridSizes: { xxl: number; xl: number; lg: number; md: number; sm: number; xs: number };
    listCategories: IGetCategories[];
    isBook?: boolean;
    showRibbon?: boolean;
    ribbonText?: string;
    ribbonColor?: string;
}

const BookCard: FC<BookCardProps> = ({
    book, gridSizes, listCategories,
    isBook = false, showRibbon = false,
    ribbonText = "HOT", ribbonColor = "red"
}) => {
    const { isDarkTheme } = useAppProvider();
    const navigate = useNavigate();

    const renderTag = useCallback((id: string) => {
        const category = listCategories.find((x) => x._id === id);
        return category ? (
            <Tag
                color="volcano"
                key={category._id}
                onClick={(e) => e.stopPropagation()}
            >
                {category.name}
            </Tag>
        ) : null;
    }, [listCategories]);

    const handleCardClick = () => {
        navigate(`/book/${book._id}`);
    };

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
                    <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", borderRadius: "12px" }}>
                        <img
                            alt={book.title}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                transition: "transform 0.3s ease-in-out",
                            }}
                        />
                    </div>
                }
            >
                <Card.Meta
                    title={
                        <Tooltip title={book.title}>
                            <Typography.Title
                                level={5}
                                style={{ margin: 0 }}

                            >
                                {book.title}
                            </Typography.Title>
                        </Tooltip>
                    }
                    description={
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                                    <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
                                        {book.author.join(", ")}
                                    </Typography.Paragraph>
                                </Space>
                            </Tooltip>

                            <Space>
                                <ShoppingCartOutlined style={{ color: "#FF5733" }} />
                                <Typography.Paragraph style={{ margin: 0 }}>
                                    Đã bán: {book.sold ?? 0}
                                </Typography.Paragraph>
                                <CalendarOutlined style={{ color: "#FF5733" }} />
                                <Typography.Paragraph style={{ margin: 0 }}>
                                    {new Date(book.createdAt || "").toLocaleDateString()}
                                </Typography.Paragraph>
                            </Space>

                            <Space>
                                <TagOutlined style={{ color: "#FF5733" }} />
                                <Typography.Paragraph strong style={{ color: "#FF5733", fontSize: "16px", margin: 0 }}>
                                    {book.price.toLocaleString()} VNĐ
                                </Typography.Paragraph>
                            </Space>

                            <Space>
                                <HeartOutlined style={{ color: "#FF5733" }} />
                                <Rate disabled value={book.rating || 0} allowHalf />
                            </Space>

                            <Space align="center" style={{ display: "flex" }} onClick={(e) => e.stopPropagation()}>
                                <InputNumber
                                    min={1}
                                    defaultValue={1}
                                    size="small"
                                    style={{ padding: "6px", width: "100%" }}
                                />
                                <Button
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    style={{ background: "#FF5733", borderColor: "#FF5733", flex: 2 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Xử lý thêm vào giỏ hàng
                                    }}
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
                <Badge.Ribbon text={ribbonText} color={ribbonColor}>
                    {CardContent}
                </Badge.Ribbon>
            ) : (
                CardContent
            )}
        </Col>
    );
};

export default BookCard;
