import { Card, Col, Rate, Row, Button, Space, Typography, Tooltip, Tag, InputNumber, Skeleton, Badge } from "antd";
import { FC } from "react";
import { ShoppingCartOutlined, TagOutlined, HeartOutlined, UserOutlined, CalendarOutlined, FireOutlined, ImportOutlined } from "@ant-design/icons";
import Container from "@/components/layout/client/container.layout";

type IProps = {
    dataBook: Record<string, IGetBook[]>;
    loading: boolean;
    dataCategory: IGetCategories[]; // Dữ liệu danh mục
};

const Product: FC<IProps> = ({ dataBook, loading, dataCategory }) => {
    const books: IGetBook[] = Object.values(dataBook).flat();


    const topSoldBooks = [...books]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 10);

    const newBooks = [...books]
        .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        .slice(0, 20);
    const renderTag = (id: string) => {
        const category = dataCategory.find((x) => x._id === id);
        return category ? <Tag color="volcano" key={category._id}>{category.name}</Tag> : null;
    };

    const renderBookCard = (book: IGetBook) => (
        <Col key={book._id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Badge.Ribbon text="HOT" color="red"
                style={{
                    // display: book.sold && book.sold >= 0 ? "block" : "none" 

                }}>
                <Card
                    hoverable
                    style={{
                        borderRadius: "12px",
                        padding: "10px",
                        overflow: "hidden",
                        transition: "transform 0.3s ease-in-out",
                    }}
                    cover={
                        <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", borderRadius: "12px" }}>
                            <img
                                alt={book.title}
                                src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease-in-out",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div>
                                    {book.attributes?.classification?.map((category) => renderTag(category))}
                                </div>

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
                                    <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
                                        Đã bán: {book.sold && typeof book.sold === "number" ? book.sold : "0"}
                                    </Typography.Paragraph>
                                    <CalendarOutlined style={{ color: "#FF5733" }} />
                                    <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
                                        {new Date(book.createdAt || "").toLocaleDateString()}
                                    </Typography.Paragraph>
                                </Space>

                                <Space>
                                    <TagOutlined style={{ color: "#FF5733" }} />
                                    <Typography.Paragraph strong style={{ color: "#FF5733", fontSize: "16px", margin: 0 }} ellipsis={{ rows: 1 }}>
                                        {book.price.toLocaleString()} VNĐ
                                    </Typography.Paragraph>
                                </Space>

                                <Space>
                                    <HeartOutlined style={{ color: "#FF5733" }} />
                                    <Rate disabled value={book.rating || 0} allowHalf />
                                </Space>

                                {/* Nút thêm vào giỏ hàng */}
                                <Space align="center">
                                    <InputNumber min={1} defaultValue={1} size="small" style={{ padding: "6px" }} />
                                    <Button type="primary" icon={<ShoppingCartOutlined />} style={{ background: "#FF5733", borderColor: "#FF5733" }}>
                                        Add to cart
                                    </Button>
                                </Space>
                            </div>
                        }
                    />
                </Card>
            </Badge.Ribbon>
        </Col>
    );

    return (
        <Container>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                {/* Sách Bán Chạy */}
                <Card size="default">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ margin: 0, color: "#FF5733" }}>
                            <FireOutlined /> Sách Bán Chạy Nhất
                        </h2>
                        <Button type="link" style={{ color: "#FF5733" }}>Xem tất cả</Button>
                    </div>
                    {loading ? <Skeleton active /> : <Row gutter={[16, 16]}>{topSoldBooks.map(renderBookCard)}</Row>}
                </Card>

                {/* Sách Mới Nhất */}
                <Card size="default">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ margin: 0, color: "#FF5733" }}>
                            <ImportOutlined /> Sách Mới Nhất
                        </h2>
                        <Button type="link" style={{ color: "#FF5733" }}>Xem tất cả</Button>
                    </div>
                    {loading ? <Skeleton active /> : <Row gutter={[16, 16]}>{newBooks.map(renderBookCard)}</Row>}
                </Card>
            </Space>
        </Container>

    );
};

export default Product;
