import { getBookApi, getAllBookApi, getAllCategoryApi } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    Skeleton,
    Typography,
    Image,
    Row,
    Col,
    Rate,
    Button,
    Tag,
    Carousel,
    Breadcrumb,
    List,
    Avatar,
    Space,
    InputNumber,
} from "antd";
import Container from "@/components/layout/client/container.layout";
// import { BookCard } from "@/components/client/home/book-card";
import { CaretRightOutlined, CaretLeftOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import BookCard from "@/components/client/home/book-card";

const { Title, Text, Paragraph } = Typography;

const BookDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IGetBook | undefined>(undefined);
    const [suggestedBooks, setSuggestedBooks] = useState<IGetBook[]>([]);
    const [dataCategory, setDataCategory] = useState<IGetCategories[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);

    // Fetch book details and categories
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch book
                const bookRes = await getBookApi(id || "");
                if (bookRes.data) {
                    setBook(bookRes.data);
                } else {
                    setBook(undefined);
                }

                // Fetch categories
                const categoryRes = await getAllCategoryApi("isBook=true");
                if (categoryRes.data) {
                    setDataCategory(categoryRes.data.result || []);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setBook(undefined);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [id]);

    // Fetch suggested books
    useEffect(() => {
        const fetchSuggestedBooks = async () => {
            setIsLoadingSuggestions(true);
            try {
                const query = "pageSize=6&isBook=true&sort=-sold";
                const res = await getAllBookApi(query);
                if (res.data && res.data.result) {
                    setSuggestedBooks(res.data.result.filter((b: IGetBook) => b._id !== id));
                }
            } catch (error) {
                console.error("Error fetching suggested books:", error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };
        fetchSuggestedBooks();
    }, [id]);

    // Format date
    const formatDate = (date?: Date | number | string) => {
        if (!date) return "N/A";
        return dayjs(date).format("DD/MM/YYYY");
    };


    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const carouselRef = useRef<any>(null);
    // Tạo mảng tất cả ảnh (logo + coverImage)
    const allImages = [book?.logo, ...(book?.coverImage || [])].filter(Boolean) as string[];

    // Grid sizes for BookCard
    const gridSizes = { xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 };


    const arrowStyle = {

    };

    const prevArrow = (
        <div
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.4)",
                color: "#fff",
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                zIndex: 1, left: "12px"
            }}
            onClick={() => carouselRef.current?.prev()}
        >
            <LeftOutlined />
        </div>
    );

    const nextArrow = (
        <div
            style={{

                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.4)",
                color: "#fff",
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                zIndex: 1, right: "12px"
            }}
            onClick={() => carouselRef.current?.next()}
        >
            <RightOutlined />
        </div>
    );

    return (
        <div style={{ marginTop: "100px", position: 'relative' }}>
            <Container>

                {/* Breadcrumb */}
                <Breadcrumb style={{ marginBottom: "16px" }}>
                    <Breadcrumb.Item>
                        <a href="/">Trang chủ</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/books">Sách</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{book?.title || "Chi tiết sách"}</Breadcrumb.Item>
                </Breadcrumb>

                {isLoading ? (
                    <Skeleton active paragraph={{ rows: 10 }} />
                ) : book ? (
                    <>
                        {/* Main Layout: Split into Left and Right Sections */}
                        <Row gutter={[16, 16]}>
                            {/* Left Section: Images, Book Details, Description */}
                            <Col xs={24} sm={24} md={18}>
                                {/* Row for Images and Book Details */}
                                <Row gutter={[16, 16]}>
                                    {/* Left Column: Images */}
                                    <Col xs={24} sm={24} md={8}>
                                        <div style={{ position: "sticky", top: "100px" }}>
                                            {prevArrow}
                                            {nextArrow}
                                            <Carousel
                                                dots={false}

                                                centerMode={true}
                                                arrows={false}
                                                effect="scrollx"
                                                style={{ borderRadius: 8, overflow: "hidden", height: "500px", border: "1px solid #ddd", marginBottom: "16px" }}
                                                ref={carouselRef}
                                                afterChange={(current) => setCurrentSlide(current)}
                                            >
                                                {allImages.map((img, index) => (
                                                    <div key={index} style={{ textAlign: "center" }}>
                                                        <div
                                                            style={{

                                                                width: "100%",
                                                                height: "100%",
                                                                overflow: "hidden", // Đảm bảo ảnh không bị tràn ra ngoài
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",

                                                            }}
                                                        >
                                                            <div style={{ height: "500px", overflow: "hidden", position: "relative", backgroundColor: "#f0f0f0", borderRadius: "8px", margin: "0 12px" }}>
                                                                <Image
                                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${img}`}
                                                                    alt={`Image ${index + 1}`}
                                                                    preview
                                                                    style={{
                                                                        height: "100%",
                                                                        width: "100%",
                                                                        transition: "transform 0.5s ease-in-out",
                                                                        objectFit: "cover",

                                                                    }}
                                                                    className="custom-image"
                                                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.025)")}
                                                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}

                                            </Carousel>

                                            {/* Thumbnail Images */}
                                            <Row gutter={[8, 8]} justify="center">
                                                {allImages.map((img, index) => (
                                                    <Col key={index}>
                                                        <Image
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${img}`}
                                                            alt={`${book?.title} thumbnail ${index + 1}`}
                                                            style={{
                                                                width: "60px",
                                                                height: "60px",
                                                                objectFit: "cover",
                                                                borderRadius: "4px",
                                                                cursor: "pointer",
                                                                border: currentSlide === index ? "2px solid #1890FF" : "1px solid #ddd",
                                                            }}
                                                            preview={false}
                                                            onClick={() => {
                                                                carouselRef.current?.goTo(index);
                                                                setCurrentSlide(index);
                                                            }}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </Col>

                                    {/* Middle Column: Book Details */}
                                    <Col xs={24} sm={24} md={16}>
                                        <div style={{ minHeight: "100vh" }}>
                                            <Title level={2} style={{ marginTop: 0 }}>
                                                {book.title}
                                            </Title>
                                            <Space wrap style={{ marginBottom: "16px" }}>
                                                {book.author.map((author, index) => (
                                                    <Tag key={index} color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>
                                                        {author}
                                                    </Tag>
                                                ))}
                                            </Space>
                                            <Space style={{ marginBottom: "16px" }}>
                                                <Rate allowHalf disabled value={book.rating || 0} />
                                                <Text>({book.sold} Đã bán)</Text>
                                            </Space>
                                            <Text
                                                strong
                                                style={{ display: "block", fontSize: "24px", color: "#FF5733", marginBottom: "8px" }}
                                            >
                                                {book.price.toLocaleString()} VND
                                            </Text>
                                            <Text
                                                delete
                                                style={{ display: "block", fontSize: "16px", color: "#888", marginBottom: "16px" }}
                                            >
                                                {(book.price * 1.2).toLocaleString()} VND
                                            </Text>
                                            <Space direction="vertical" size="small" style={{ width: "100%", marginBottom: "16px" }}>
                                                <Text>
                                                    <strong>Nhà xuất bản:</strong> {book.attributes?.publisher || "N/A"}
                                                </Text>
                                                <Text>
                                                    <strong>Ngày xuất bản:</strong> {formatDate(book.attributes?.publishedDate)}
                                                </Text>
                                                <Text>
                                                    <strong>ISBN:</strong> {book.attributes?.isbn || "N/A"}
                                                </Text>
                                                <Text>
                                                    <strong>Ngôn ngữ:</strong> {book.attributes?.language || "N/A"}
                                                </Text>
                                                <Text>
                                                    <strong>Số trang:</strong> {book.attributes?.pages || "N/A"}
                                                </Text>
                                                <Text>
                                                    <strong>Thể loại:</strong>{" "}
                                                    {book.attributes?.classification?.length ? (
                                                        <Space wrap>
                                                            {book.attributes.classification.map((catId) => {
                                                                const category = dataCategory.find((cat) => cat._id === catId);
                                                                return category ? (
                                                                    <Tag key={catId} color="green" style={{ fontSize: "14px", padding: "4px 8px" }}>
                                                                        {category.name}
                                                                    </Tag>
                                                                ) : null;
                                                            })}
                                                        </Space>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </Text>
                                                <Text>
                                                    <strong>Kho:</strong> {book.stock} cuốn
                                                </Text>
                                                <Text>
                                                    <strong>Đã bán:</strong> {book.sold} cuốn
                                                </Text>
                                            </Space>
                                        </div>
                                    </Col>

                                    {/* Description: Below Images */}
                                    <Col xs={24} sm={24} md={8}>
                                        <Card
                                            title={<Title level={4}>Mô tả sách</Title>}
                                            style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                        >
                                            <div
                                                style={{ padding: "16px", lineHeight: "1.8" }}
                                                dangerouslySetInnerHTML={{ __html: book.description || "<p>Không có mô tả.</p>" }}
                                            />
                                        </Card>
                                    </Col>

                                    {/* New Column: Below Middle Column */}
                                    <Col xs={24} sm={24} md={16}>
                                        <Card
                                            title={<Title level={4}>Thông tin bổ sung</Title>}
                                            style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                        >
                                            <Text>Đây là phần thông tin bổ sung về sách (placeholder).</Text>
                                            <Space direction="vertical" style={{ width: "100%", marginTop: "16px" }}>
                                                <Text>- Chính sách đổi trả: Đổi trả trong 7 ngày nếu có lỗi từ nhà xuất bản.</Text>
                                                <Text>- Bảo hành: Không áp dụng.</Text>
                                                <Text>- Thông tin liên hệ: Liên hệ nhà xuất bản qua email hoặc hotline.</Text>
                                            </Space>
                                        </Card>
                                        <Card
                                            title={<Title level={4}>Đánh giá từ người đọc</Title>}
                                            style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                        >
                                            {book.reviews && book.reviews.length > 0 ? (
                                                <List
                                                    itemLayout="vertical"
                                                    dataSource={book.reviews}
                                                    renderItem={(review) => (
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar>{review.userId.slice(0, 1).toUpperCase()}</Avatar>}
                                                                title={
                                                                    <Space>
                                                                        <Text strong>{review.userName}</Text>
                                                                        <Rate allowHalf disabled value={review.rating} />
                                                                    </Space>
                                                                }
                                                                description={
                                                                    <>
                                                                        <Paragraph>{review.comment}</Paragraph>
                                                                        <Text type="secondary">{dayjs(review.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
                                                                    </>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            ) : (
                                                <Text>Chưa có đánh giá nào.</Text>
                                            )}
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Right Column: Price, Quantity, Actions */}
                            <Col xs={24} sm={24} md={6}>
                                <div style={{ position: "sticky", top: "100px", marginBottom: "24px" }}>
                                    <Card style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                        <Text strong style={{ fontSize: "20px", color: "#FF5733" }}>
                                            {book.price.toLocaleString()} VND
                                        </Text>
                                        <Text
                                            delete
                                            style={{ display: "block", fontSize: "14px", color: "#888", marginBottom: "16px" }}
                                        >
                                            {(book.price * 1.2).toLocaleString()} VND
                                        </Text>
                                        <Text style={{ display: "block", marginBottom: "16px" }}>
                                            <strong>Số lượng:</strong>
                                        </Text>
                                        <InputNumber
                                            min={1}
                                            max={book.stock}
                                            value={quantity}
                                            onChange={(value) => setQuantity(value || 1)}
                                            style={{ width: "100%", marginBottom: "16px" }}
                                        />
                                        <Text style={{ display: "block", marginBottom: "16px" }}>
                                            <strong>Tạm tính:</strong> {(book.price * quantity).toLocaleString()} VND
                                        </Text>
                                        <Button
                                            type="primary"
                                            size="large"
                                            style={{
                                                width: "100%",
                                                height: "50px",
                                                fontSize: "18px",
                                                backgroundColor: "#FF4D4F",
                                                borderColor: "#FF4D4F",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            Mua ngay
                                        </Button>
                                        <Button
                                            size="large"
                                            style={{ width: "100%", height: "50px", fontSize: "18px", marginBottom: "16px" }}
                                        >
                                            Thêm vào giỏ
                                        </Button>
                                        {/* Promotions */}
                                        <Space direction="vertical" style={{ width: "100%" }}>
                                            <Text style={{ color: "#1890FF" }}>
                                                Freeship 10k đơn từ 45K, Freeship 25k đơn từ 100K
                                            </Text>
                                            <Text style={{ color: "#1890FF" }}>
                                                Hoàn tiền 5% khi thanh toán qua ví
                                            </Text>
                                        </Space>
                                    </Card>
                                </div>
                            </Col>
                        </Row>

                        {/* Suggested Books, Reviews */}
                        <Row>
                            <Col span={24}>
                                {/* Suggested Books */}
                                <Card
                                    title={<Title level={4}>Sách gợi ý</Title>}
                                    style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                >
                                    {isLoadingSuggestions ? (
                                        <Skeleton active paragraph={{ rows: 4 }} />
                                    ) : suggestedBooks.length > 0 ? (
                                        < >
                                            <Row gutter={[16, 16]}>{suggestedBooks
                                                .map((x) => {
                                                    return <BookCard
                                                        key={x._id}
                                                        book={x}
                                                        gridSizes={{ xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 }}
                                                        listCategories={dataCategory}
                                                        isBook
                                                        showRibbon
                                                    />
                                                })}</Row>
                                        </>
                                    ) : (
                                        <Text>Không có sách gợi ý.</Text>
                                    )}
                                </Card>

                                {/* Reviews */}

                            </Col>
                        </Row>
                    </>
                ) : (
                    <Card>
                        <Text type="danger">Không tìm thấy sách!</Text>
                    </Card>
                )
                }

            </Container >
        </div >
    );
};

export default BookDetailPage;