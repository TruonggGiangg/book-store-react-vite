import { getBookApi } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Skeleton, Typography, Image, Row, Col, Rate, Button } from "antd";
import Container from "@/components/layout/client/container.layout";

const { Title, Text, Paragraph } = Typography;

const BookDetailPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState<IGetBook | undefined>(undefined);
    const [isLoad, setIsLoad] = useState<boolean>(false);

    useEffect(() => {
        const fetchBook = async () => {
            setIsLoad(true);
            const res = await getBookApi(id + "");
            if (res.data) {
                setBook(res.data);
            } else {
                setBook(undefined);
            }
            setIsLoad(false);
        };
        fetchBook();
    }, [id]);

    return (
        <Container>
            <Card style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
                {isLoad ? (
                    <Skeleton active />
                ) : book ? (
                    <Row gutter={[32, 32]} align="middle">
                        {/* Ảnh bìa sách */}
                        <Col xs={24} md={10}>
                            <Image
                                src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo as string}`}
                                alt={book.title}
                                style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "10px" }}
                            />
                        </Col>

                        {/* Nội dung sách */}
                        <Col xs={24} md={14}>
                            <Title level={1}>{book.title}</Title>
                            <Text type="secondary" style={{ fontSize: "18px", display: "block", marginBottom: "10px" }}>
                                Tác giả: {book.author.join(", ")}
                            </Text>
                            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8", textAlign: "justify" }}>
                                {book.description || "Không có mô tả"}
                            </Paragraph>

                            {/* Đánh giá & Giá */}
                            <Rate allowHalf disabled defaultValue={book.rating || 4} />
                            <Text strong style={{ display: "block", fontSize: "24px", color: "#FF5733", marginTop: "10px" }}>
                                {book.price.toLocaleString()} VND
                            </Text>

                            {/* Button mua sách */}
                            <Button type="primary" size="large" style={{ marginTop: "20px", width: "200px", height: "50px", fontSize: "18px" }}>
                                Mua ngay
                            </Button>
                        </Col>
                    </Row>
                ) : (
                    <Text type="danger">Không tìm thấy sách!</Text>
                )}
            </Card>
        </Container>
    );
};

export default BookDetailPage;
