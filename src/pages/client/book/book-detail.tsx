import { getBookApi, getAllBookApi, getAllCategoryApi, updateBookApi } from "@/services/api";
import { lazy, useEffect, useRef, useState } from "react";
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
    Collapse,
    Divider,
    Badge,
    message,
    Input,
} from "antd";
import img404 from '@/assets/img/book-with-broken-pages.gif'
import Container from "@/components/layout/client/container.layout";
import { AlignLeftOutlined, CustomerServiceOutlined, FileProtectOutlined, InfoCircleOutlined, LeftOutlined, RightOutlined, SwapOutlined, ToolOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { TextArea } = Input;

import { useAppProvider } from "@/components/context/app.context";
import ReviewsModal from "@/components/client/book/review";


const BookCard = lazy(() => import("@/components/client/home/book-card"));
const ListCardSkeleton = lazy(() => import("@/components/client/home/skeleton"));

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const BookDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IGetBook | undefined>(undefined);
    const [dataCategory, setDataCategory] = useState<IGetCategories[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize as true to show skeleton initially
    const [quantity, setQuantity] = useState<number>(1);
    const [dataToolsHot, setDataToolsHot] = useState<IGetBook[]>([]);
    const [loadingHotTool, setLoadingHotTool] = useState<boolean>(false);
    const [suggestedBooks, setSuggestedBooks] = useState<IGetBook[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
    const [booksByCategory, setBooksByCategory] = useState<IGetBook[]>([]);
    const [loadingBooks, setLoadingBooks] = useState<boolean>(false);
    const { isDarkTheme } = useAppProvider();
    const { currUser } = useAppProvider();

    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const carouselRef = useRef<any>(null);

    useEffect(() => {
        // Cuộn lên đầu trang mỗi khi route thay đổi
        window.scrollTo(0, 0);
    }, []);

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
                console.error("Error Noi fetching suggested books:", error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };
        fetchSuggestedBooks();
    }, [id]);

    // Fetch Hot Tools
    useEffect(() => {
        const fetchHotTools = async () => {
            setLoadingHotTool(true);
            try {
                const hotTools = await getAllBookApi('current=1&pageSize=12&sort=-sold&isBook=false');
                if (hotTools.data) setDataToolsHot(hotTools.data.result);
            } catch (error) {
                console.error("Error fetching hot tools", error);
            }
            setLoadingHotTool(false);
        };
        fetchHotTools();
    }, []);

    // Fetch Books by Category
    useEffect(() => {
        const fetchBooks = async () => {
            if (!book?.attributes?.classification?.length) return;

            setLoadingBooks(true);
            const categoryIds = book.attributes.classification;

            try {
                const query = `current=1&pageSize=6&sort=-sold&attributes.classification=${categoryIds
                    .map((id) => `/${id}/i`)
                    .join(",")}`;
                const data = await getAllBookApi(query);
                setBooksByCategory(data.data?.result || []);
            } catch (error) {
                console.error("Lỗi khi tải sách:", error);
            } finally {
                setLoadingBooks(false);
            }
        };
        fetchBooks();
    }, [book]);

    // Format date
    const formatDate = (date?: Date | number | string) => {
        if (!date) return "N/A";
        return dayjs(date).format("DD/MM/YYYY");
    };

    // Tạo mảng tất cả ảnh (logo + coverImage)
    const allImages = [book?.logo, ...(book?.coverImage || [])].filter(Boolean) as string[];

    // Grid sizes for BookCard
    const gridSizes = { xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 };

    // Custom arrows
    const prevArrow = (
        <div
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-150%)",
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
                zIndex: 1,
                left: "12px",
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
                transform: "translateY(-150%)",
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
                zIndex: 1,
                right: "12px",
            }}
            onClick={() => carouselRef.current?.next()}
        >
            <RightOutlined />
        </div>
    );


    //modal show all review
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleShowAll = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (comment: string, rating: number) => {
        if (!currUser) {
            message.error('Vui lòng đăng nhập để đánh giá!');
            return;
        }

        if (rating === 0) {
            message.error('Vui lòng đánh giá ít nhất 1 sao!');
            return;
        }


        const newReview: Review = {
            userId: currUser?._id,
            userName: currUser?.name || 'Người dùng',
            comment,
            rating,
            createdAt: new Date(),
        };

        if (!book) return;

        const reviews = [...(book.reviews || []), newReview];
        const avgRating = calculateAverageRating(reviews);

        const updatedBook: ICreateBook & { reviews: Review[]; rating?: number } = {
            title: book.title,
            author: book.author,
            isBook: book.isBook,
            price: book.price,
            stock: book.stock,
            sold: book.sold ?? 0,
            description: book.description ?? '',
            coverImage: book.coverImage,
            logo: book.logo,
            attributes: book.attributes ?? {},
            reviews,
            rating: avgRating,
        };

        try {
            await updateBookApi(updatedBook, String(book._id));
            message.success('Đánh giá đã được gửi!');
            setBook({ ...book, reviews, rating: avgRating });
            setComment('');
            setRating(0);
        } catch (error) {
            message.error('Không thể gửi đánh giá. Vui lòng thử lại!');
        }
    };

    const calculateAverageRating = (reviews: Review[]): number => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        return Number((total / reviews.length).toFixed(1));
    };



    // Detailed Skeleton for Loading State
    const DetailedSkeleton = () => (
        <div>
            {/* Breadcrumb Skeleton */}
            <Skeleton active paragraph={{ rows: 0 }} title={{ width: "20%" }} style={{ marginBottom: "16px" }} />

            <Row gutter={[16, 16]}>
                {/* Left Section: Images, Book Details, Description */}
                <Col xs={24} sm={24} md={18}>
                    <Row gutter={[16, 16]}>
                        {/* Left Column: Images */}
                        <Col xs={24} sm={24} md={10}>
                            <div style={{ position: "sticky", top: "100px" }}>
                                <Skeleton.Image style={{ width: "100%", height: "500px", borderRadius: "8px", marginBottom: "16px" }} active />
                                <Row gutter={[8, 8]} justify="center">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Col key={index}>
                                            <Skeleton.Image style={{ width: "60px", height: "60px", borderRadius: "4px" }} active />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Col>

                        {/* Middle Column: Book Details */}
                        <Col xs={24} sm={24} md={14}>
                            <div style={{ minHeight: "" }}>
                                <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 0 }} />
                                <Skeleton active paragraph={{ rows: 2, width: ["30%", "20%"] }} />
                                <Skeleton active paragraph={{ rows: 1, width: ["40%"] }} />
                                <Skeleton active title={{ width: "50%" }} paragraph={{ rows: 0 }} />
                                <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
                                <Skeleton active paragraph={{ rows: 6, width: ["80%", "60%", "70%", "50%", "65%", "55%"] }} />
                            </div>
                        </Col>

                        {/* Description: Below Images */}
                        <Col xs={24} sm={24} md={10}>
                            <Card style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 4 }} />
                            </Card>
                        </Col>

                        {/* New Column: Below Middle Column */}
                        <Col xs={24} sm={24} md={14}>
                            <Card style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 3 }} />
                            </Card>
                            <Card style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 5 }} />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Right Column: Price, Quantity, Actions */}
                <Col xs={24} sm={24} md={6}>
                    <div style={{ position: "sticky", top: "100px", marginBottom: "24px" }}>
                        <Card style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                            <Skeleton active title={{ width: "50%" }} paragraph={{ rows: 0 }} />
                            <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
                            <Skeleton.Input active style={{ width: "100%", height: "40px", marginBottom: "16px" }} />
                            <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 0 }} />
                            <Skeleton.Button active style={{ width: "100%", height: "50px", marginBottom: "16px" }} />
                            <Skeleton.Button active style={{ width: "100%", height: "50px", marginBottom: "16px" }} />
                            <Skeleton active paragraph={{ rows: 2, width: ["80%", "60%"] }} />
                        </Card>
                    </div>
                </Col>


            </Row>
        </div>
    );

    return (
        <div style={{ marginTop: "100px", position: "relative" }}>
            <Container>
                {isLoading ? (
                    <DetailedSkeleton />
                ) : book ? (
                    <>
                        {/* Breadcrumb */}
                        <Breadcrumb style={{ marginBottom: "16px" }}>
                            <Breadcrumb.Item>
                                <a href="/">Trang chủ</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="/books">Sách</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {book?.title || "Chi tiết sách"}
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        {/* Main Layout: Split into Left and Right Sections */}
                        <Row gutter={[16, 16]}>
                            {/* Left Section: Images, Book Details, Description */}
                            <Col sm={24} md={24} lg={18}>
                                {/* Row for Images and Book Details */}
                                <Row gutter={[16, 16]}>
                                    {/* Left Column: Images */}
                                    <Col sm={24} md={24} lg={10}>
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
                                                                overflow: "hidden",
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
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = img404; // Dùng ảnh lỗi khi ảnh không thể tải
                                                                    }}
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
                                                            onError={(e) => {
                                                                e.currentTarget.src = img404; // Dùng ảnh lỗi khi ảnh không thể tải
                                                            }}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </Col>

                                    {/* Middle Column: Book Details */}
                                    <Col sm={24} md={24} lg={14}>
                                        <div style={{ minHeight: "" }}>
                                            <Card
                                                size="default"
                                                style={{
                                                    padding: "16px",
                                                    marginBottom: "24px",
                                                    width: "100%",
                                                    boxShadow: isDarkTheme
                                                        ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
                                                        : "0px 0px 12px rgba(0, 0, 0, 0.1)",
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                }}
                                                title={
                                                    <Typography.Title
                                                        style={{

                                                            fontWeight: "bold",
                                                            color: isDarkTheme ? "#FFF" : "#333",
                                                        }}
                                                    >
                                                        {book.title}
                                                    </Typography.Title>
                                                }
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                                }}
                                            >


                                                <Space wrap style={{ marginBottom: "16px" }}>
                                                    {book.author.map((author, index) => (
                                                        <Tag key={index} color="volcano-inverse" style={{ fontSize: "14px", padding: "4px 8px" }}>
                                                            {author}
                                                        </Tag>
                                                    ))}
                                                </Space>
                                                <br />

                                                <Text
                                                    strong
                                                    style={{ display: "block", fontSize: "24px", color: "#FF5733", marginBottom: "8px" }}
                                                >
                                                    {book.price.toLocaleString()} VND
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
                                                        <strong style={{ marginRight: "6px" }}>Thể loại:</strong>{" "}
                                                        {book.attributes?.classification?.length ? (
                                                            <Space wrap>
                                                                {book.attributes.classification.map((catId) => {
                                                                    const category = dataCategory.find((cat) => cat._id === catId);
                                                                    return category ? (
                                                                        <Tag key={catId} color="volcano" style={{ fontSize: "14px", padding: "4px 8px" }}>
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
                                                <Space style={{ marginBottom: "16px" }}>
                                                    <Rate allowHalf disabled value={book.rating || 0} />
                                                    <Text>({book.sold} Đã bán)</Text>
                                                </Space>
                                            </Card>
                                        </div>


                                    </Col>

                                    {/* Description: Below Images */}
                                    <Col sm={24} md={24} lg={10}>
                                        <Card
                                            title={
                                                <Title
                                                    level={4}
                                                    style={{
                                                        margin: 0,

                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    <AlignLeftOutlined style={{ marginRight: 8 }} />
                                                    Mô tả sản phẩm
                                                </Title>
                                            }
                                            style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", transition: 'transform 0.3s ease, box-shadow 0.3s ease', }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                            }}
                                        >
                                            <div
                                                style={{ padding: "16px", lineHeight: "1.8" }}
                                                dangerouslySetInnerHTML={{ __html: book.description || "<p>Không có mô tả.</p>" }}
                                            />
                                        </Card>
                                    </Col>

                                    {/* New Column: Below Middle Column */}
                                    <Col sm={24} md={24} lg={14}>
                                        <Card
                                            title={
                                                <Title
                                                    level={4}
                                                    style={{
                                                        margin: 0,

                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                                                    Thông tin bổ sung
                                                    <Badge
                                                        dot

                                                        style={{ marginLeft: '8px', marginTop: "4px", animation: 'pulse 2s infinite' }}
                                                    />
                                                </Title>
                                            }
                                            style={{
                                                marginBottom: '24px',
                                                borderRadius: '12px',
                                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            }}

                                            hoverable
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                            }}
                                        >
                                            <Paragraph >
                                                Dưới đây là những thông tin bổ sung giúp bạn hiểu rõ hơn về sản phẩm và dịch vụ liên quan.
                                            </Paragraph>

                                            <Collapse
                                                ghost
                                                accordion
                                                expandIconPosition="right"
                                                style={{
                                                    background: 'transparent',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <Panel
                                                    header={
                                                        <Space>
                                                            <SwapOutlined />
                                                            <Text strong >
                                                                Chính sách đổi trả
                                                            </Text>
                                                        </Space>
                                                    }
                                                    key="1"
                                                    style={{ borderBottom: '1px solid #E8E8E8' }}
                                                >
                                                    <Text >
                                                        Sản phẩm được đổi trả trong vòng <strong >7 ngày</strong> nếu có lỗi do nhà sản xuất hoặc bị hư hỏng trong quá trình vận chuyển. Vui lòng giữ hóa đơn và bao bì sản phẩm để được hỗ trợ nhanh chóng.
                                                    </Text>
                                                </Panel>

                                                <Panel
                                                    header={
                                                        <Space>
                                                            <FileProtectOutlined />
                                                            <Text strong >
                                                                Chính sách bảo hành
                                                            </Text>
                                                        </Space>
                                                    }
                                                    key="2"
                                                    style={{ borderBottom: '1px solid #E8E8E8' }}
                                                >
                                                    <Text >
                                                        Sản phẩm không áp dụng chính sách bảo hành. Mọi hỗ trợ liên quan đến lỗi sản xuất sẽ được xử lý thông qua chính sách đổi trả.
                                                    </Text>
                                                </Panel>

                                                <Panel
                                                    header={
                                                        <Space>
                                                            <CustomerServiceOutlined />
                                                            <Text strong style={{}}>
                                                                Thông tin liên hệ
                                                            </Text>
                                                        </Space>
                                                    }
                                                    key="3"
                                                    style={{ borderBottom: '1px solid #E8E8E8' }}
                                                >
                                                    <Space direction="vertical">
                                                        <Text >
                                                            <strong>Email:</strong> hotro@nhaxuatban.vn
                                                        </Text>
                                                        <Text >
                                                            <strong>Hotline:</strong> 1900 636 999
                                                        </Text>
                                                        <Text >
                                                            <strong>Thời gian hỗ trợ:</strong> 8:00 - 17:00 (Thứ 2 - Thứ 7)
                                                        </Text>
                                                    </Space>
                                                    <Badge
                                                        dot

                                                        style={{ marginLeft: '8px', animation: 'pulse 2s infinite' }}
                                                    />
                                                </Panel>

                                                <Panel
                                                    header={
                                                        <Space>
                                                            <InfoCircleOutlined />
                                                            <Text strong >
                                                                Hướng dẫn sử dụng sản phẩm
                                                            </Text>
                                                        </Space>
                                                    }
                                                    key="4"
                                                    style={{ borderBottom: '1px solid #E8E8E8' }}
                                                >
                                                    <Text >
                                                        Tránh tiếp xúc sản phẩm với nước, ánh nắng trực tiếp. Bảo quản sách nơi khô ráo, tránh ẩm mốc để giữ độ bền lâu dài.
                                                    </Text>
                                                </Panel>


                                            </Collapse>



                                            <Paragraph
                                                italic
                                                style={{
                                                    fontSize: '14px',
                                                    textAlign: 'right',
                                                    margin: 0,
                                                }}
                                            >
                                                Mọi thắc mắc khác, vui lòng liên hệ chúng tôi để được tư vấn chi tiết hơn.
                                            </Paragraph>
                                        </Card>
                                        <Card
                                            title={<Title level={4}>Đánh giá từ người đọc</Title>}
                                            style={{ borderRadius: '8px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            extra={
                                                book.reviews && book.reviews.length > 10 && (
                                                    <Button type="link" onClick={handleShowAll}>
                                                        Xem tất cả
                                                    </Button>
                                                )
                                            }
                                        >
                                            {book.reviews && book.reviews.length > 0 ? (
                                                <List
                                                    itemLayout="vertical"
                                                    dataSource={book.reviews.slice(0, 5)}
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
                                                                        <Text type="secondary">{dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                                                                    </>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            ) : (
                                                <Text>Chưa có đánh giá nào.</Text>
                                            )}

                                            {/* Form đánh giá mới */}
                                            <div style={{ marginTop: 24 }}>
                                                <div style={{ display: "flex", gap: "12px" }}>
                                                    <Title level={5}>Đánh giá của bạn</Title>
                                                    <Rate value={rating} onChange={setRating} style={{ marginBottom: 8 }} />
                                                </div>

                                                <TextArea
                                                    rows={3}
                                                    placeholder="Nhập bình luận của bạn..."
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    style={{ marginBottom: 8 }}
                                                />
                                                <div style={{ display: "flex", justifyContent: "right" }}>
                                                    <Button type="primary" onClick={() => { handleSubmit(comment, rating) }} loading={loading}>
                                                        Gửi đánh giá
                                                    </Button>
                                                </div>

                                            </div>
                                        </Card>
                                        <ReviewsModal
                                            visible={isModalVisible}
                                            onClose={handleCloseModal}
                                            reviews={book.reviews || []}
                                        />

                                    </Col>
                                </Row>
                            </Col>

                            {/* Right Column: Price, Quantity, Actions */}
                            <Col md={24} lg={6}>
                                <div style={{ position: "sticky", top: "100px", marginBottom: "24px" }}>
                                    <Card style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                        <Text strong style={{ fontSize: "20px", color: "#FF5733" }}>
                                            {book.price.toLocaleString()} VND
                                        </Text>

                                        <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
                                            <Text strong>
                                                Số lượng
                                            </Text>
                                            <InputNumber
                                                min={1}
                                                max={book.stock}
                                                value={quantity}
                                                onChange={(value) => setQuantity(value || 1)}
                                                style={{ flex: 1, marginLeft: "16px" }}
                                            />
                                        </div>

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

                    </>
                ) : (
                    <Card>
                        <Text type="danger">Không tìm thấy sách!</Text>
                    </Card>
                )
                }
                <Row>
                    <Col span={24}>
                        {/* Suggested Books */}
                        <Card
                            size="default"
                            style={{
                                marginBottom: "24px",
                                width: "100%",
                                boxShadow: isDarkTheme
                                    ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
                                    : "0px 0px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <h2 style={{ margin: 0, color: "#FF5733" }}>
                                    <ToolOutlined /> Sách đang hot
                                </h2>
                                <Button type="link" style={{ color: "#FF5733" }}>
                                    Xem tất cả
                                </Button>
                            </div>
                            {isLoadingSuggestions ? (
                                <ListCardSkeleton count={6} />
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {suggestedBooks.map((x) => (
                                        <BookCard
                                            key={x._id}
                                            book={x}
                                            gridSizes={gridSizes}
                                            listCategories={dataCategory}
                                            isBook
                                            showRibbon
                                        />
                                    ))}
                                </Row>
                            )}
                        </Card>

                        <Card
                            size="default"
                            style={{
                                marginBottom: "24px",
                                width: "100%",
                                boxShadow: isDarkTheme
                                    ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
                                    : "0px 0px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <h2 style={{ margin: 0, color: "#FF5733" }}>
                                    <ToolOutlined /> Dụng cụ bán chạy nhất
                                </h2>
                                <Button type="link" style={{ color: "#FF5733" }}>
                                    Xem tất cả
                                </Button>
                            </div>
                            {loadingHotTool ? (
                                <ListCardSkeleton count={6} />
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {dataToolsHot.map((x) => (
                                        <BookCard
                                            key={x._id}
                                            book={x}
                                            gridSizes={gridSizes}
                                            listCategories={dataCategory}
                                            isBook
                                            showRibbon
                                        />
                                    ))}
                                </Row>
                            )}
                        </Card>

                        <Card
                            size="default"
                            style={{
                                width: "100%",
                                boxShadow: isDarkTheme
                                    ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
                                    : "0px 0px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <h2 style={{ margin: 0, color: "#FF5733" }}>
                                    <ToolOutlined /> Sách theo thể loại
                                </h2>
                                <Button type="link" style={{ color: "#FF5733" }}>
                                    Xem tất cả
                                </Button>
                            </div>
                            {loadingBooks ? (
                                <ListCardSkeleton count={6} />
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {booksByCategory.map((x) => (
                                        <BookCard
                                            key={x._id}
                                            book={x}
                                            gridSizes={gridSizes}
                                            listCategories={dataCategory}
                                            isBook
                                            showRibbon
                                        />
                                    ))}
                                </Row>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container >
        </div >
    );
};

export default BookDetailPage;