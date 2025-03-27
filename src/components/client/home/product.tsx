import Container from "@/components/layout/client/container.layout";
import { Card, Col, Rate, Row, Button, Skeleton, Space, Typography, Tooltip } from "antd";
import { FC } from "react";
import { FireOutlined, ImportOutlined, UserOutlined, TagOutlined, ShoppingCartOutlined, CalendarOutlined, HeartOutlined } from "@ant-design/icons";

type IProps = {
    dataBook: Record<string, IGetBook[]>
    loading: boolean
};

const Product: FC<IProps> = ({ dataBook, loading }) => {
    const books: IGetBook[] = Object.values(dataBook).flat();

    const topSoldBooks = [...books]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 10);

    const newBooks = [...books]
        .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        .slice(0, 20);

    const renderBookCard = (book: IGetBook) => (
        <Col key={book._id} xs={12} sm={12} md={8} lg={6} xl={4}>
            <Card
                hoverable
                style={{
                    transition: "transform 0.3s ease-in-out",
                    padding: "0px",

                }}

                cover={
                    <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
                        <img
                            alt={book.title}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
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
                            <Typography.Text strong ellipsis>{book.title}</Typography.Text>
                        </Tooltip>
                    }
                    description={
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <Tooltip title={book.author.join(", ")}>
                                <Space><UserOutlined style={{ color: "#FF5733" }} /><Typography.Text ellipsis>{book.author.join(", ")}</Typography.Text></Space>
                            </Tooltip>

                            <Space>
                                <ShoppingCartOutlined style={{ color: "#FF5733" }} />
                                <Typography.Text>
                                    Đã bán: {book.sold && typeof book.sold === "number" ? book.sold : "0"}
                                </Typography.Text>
                            </Space>

                            <Space>
                                <CalendarOutlined style={{ color: "#FF5733" }} />
                                <Typography.Text>{new Date(book.createdAt || "").toLocaleDateString()}</Typography.Text>
                            </Space>

                            <Space>
                                <TagOutlined style={{ color: "#FF5733" }} />
                                <Typography.Text strong style={{ color: "#FF5733", fontSize: "16px" }}>
                                    {book.price.toLocaleString()}₫
                                </Typography.Text>
                            </Space>

                            <Space>
                                <HeartOutlined style={{ color: "#FF5733" }} />
                                <Rate disabled value={book.rating || 0} allowHalf />
                            </Space>
                        </div>
                    }
                />
            </Card>
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
