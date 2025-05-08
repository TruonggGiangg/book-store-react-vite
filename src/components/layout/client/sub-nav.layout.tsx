import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { Button, Dropdown, Spin, Space, Typography, Row, Col } from "antd";
import { DownOutlined, BookOutlined, ToolOutlined, CalendarOutlined } from "@ant-design/icons";
import { useAppProvider } from "../../context/app.context";
import { getAllCategoryApi, getAllEventApi, getCategoryApi } from "@/services/api";
import { useNavigate, useParams } from "react-router-dom";
import Container from "./container.layout";

const SubNav: React.FC = () => {
    const { isDarkTheme } = useAppProvider();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [categories, setCategories] = useState<IGetCategories[]>([]);
    const [events, setEvents] = useState<IGetEvent[]>([]);
    const [categoryDesc, setCategoryDesc] = useState<string | null>(null);
    const [isBook, setIsBook] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, evtRes] = await Promise.all([getAllCategoryApi(""), getAllEventApi("")]);
                setCategories(catRes.data?.result || []);
                setEvents(evtRes.data?.result || []);
            } catch {
                setCategories([]);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (id) {
            getCategoryApi(id)
                .then((res) => setCategoryDesc(res.data?.data?.description || null))
                .catch(() => setCategoryDesc(null));
        } else {
            setCategoryDesc(null);
        }
    }, [id]);

    const books = useMemo(() => categories.filter((cat) => cat.isBook), [categories]);
    const tools = useMemo(() => categories.filter((cat) => !cat.isBook), [categories]);

    const booksMenu = books.map((cat) => ({
        key: cat._id,
        label: cat.name,
        onClick: () => navigate(`/books/${cat._id}`),
    }));

    const toolsMenu = tools.map((cat) => ({
        key: cat._id,
        label: cat.name,
        onClick: () => navigate(`/tools/${cat._id}`),
    }));

    const eventsMenu = events.length
        ? events.map((e) => ({
            key: e._id,
            label: e.name,
            onClick: () => navigate(`/event/${e._id}`),
        }))
        : [{ key: "no-events", label: "Sự kiện", disabled: true }];

    const handleToggle = (book: boolean) => {
        setIsBook(book);
        navigate(book ? "/books" : "/tools");
    };

    const buttonStyle = (active: boolean) => ({
        color: active ? "#fff" : isDarkTheme ? "#e5e7eb" : "#1f2937",
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        borderRadius: 6,
        border: isDarkTheme ? "1px solid #444" : "1px solid #d9d9d9",
        transition: "all 0.2s",


    });

    return (
        <Container >
            <Row
                justify="space-between"
                align="middle"
                gutter={[0, 0]}
                style={{ margin: "0 0", width: "100%" }}
            >
                {/* Dropdown Thể loại sách và Loại dụng cụ */}
                <Col xs={8} sm={8} md={8}>
                    <Space size={4}>
                        <Dropdown menu={{ items: booksMenu }} trigger={["hover"]}>
                            <Button

                                type="dashed"
                                icon={<BookOutlined />}
                                style={{
                                    color: isDarkTheme ? "#e5e7eb" : "#1f2937",
                                    fontWeight: 500,
                                    fontSize: 14,

                                }}
                            >
                                {/* Chỉ hiển thị text trên md trở lên */}
                                {window.innerWidth >= 768 ? "Thể loại sách" : null}
                                <DownOutlined style={{ marginLeft: window.innerWidth >= 768 ? 4 : 0 }} />
                            </Button>
                        </Dropdown>
                        <Dropdown menu={{ items: toolsMenu }} trigger={["hover"]}>
                            <Button

                                type="dashed"
                                icon={<ToolOutlined />}
                                style={{
                                    color: isDarkTheme ? "#e5e7eb" : "#1f2937",
                                    fontWeight: 500,
                                    fontSize: 14,

                                }}
                            >
                                {window.innerWidth >= 768 ? "Loại dụng cụ" : null}
                                <DownOutlined style={{ marginLeft: window.innerWidth >= 768 ? 4 : 0 }} />
                            </Button>
                        </Dropdown>
                    </Space>
                </Col>

                {/* Nút Tất cả sách và Tất cả dụng cụ */}
                <Col xs={8} sm={8} md={8}>
                    <Space size={4} style={{ justifyContent: "center", width: "100%" }}>
                        <Button

                            type={isBook ? "primary" : "dashed"}
                            icon={<BookOutlined />}
                            style={buttonStyle(isBook)}
                            onClick={() => handleToggle(true)}
                        >
                            {window.innerWidth >= 768 ? "Tất cả sách" : null}
                        </Button>
                        <Button

                            type={!isBook ? "primary" : "dashed"}
                            icon={<ToolOutlined />}
                            style={buttonStyle(!isBook)}
                            onClick={() => handleToggle(false)}
                        >
                            {window.innerWidth >= 768 ? "Tất cả dụng cụ" : null}
                        </Button>
                    </Space>
                </Col>

                {/* Dropdown Sự kiện */}
                <Col xs={8} sm={8} md={8}>
                    <Space style={{ justifyContent: "flex-end", width: "100%" }}>
                        <Dropdown menu={{ items: eventsMenu }} trigger={["hover"]}>
                            <Button

                                type="dashed"
                                icon={<CalendarOutlined />}
                                style={{
                                    color: isDarkTheme ? "#e5e7eb" : "#1f2937",
                                    fontWeight: 500,
                                    fontSize: 14,

                                }}
                            >
                                {window.innerWidth >= 768 ? "Sự kiện" : null}
                                <DownOutlined style={{ marginLeft: window.innerWidth >= 768 ? 4 : 0 }} />
                            </Button>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>

            {/* Mô tả danh mục (nếu có) */}
            {categoryDesc && (
                <Typography.Paragraph
                    style={{
                        margin: "16px auto 0",
                        fontSize: 14,
                        fontStyle: "italic",
                        maxWidth: 1200,
                        textAlign: "center",
                        color: isDarkTheme ? "#e5e7eb" : "#1f2937",
                    }}
                >
                    {categoryDesc}
                </Typography.Paragraph>
            )}

            {/* Loading */}
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isDarkTheme ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
                        zIndex: 1000,
                    }}
                >
                    <Spin size="large" />
                </div>
            )}
        </Container>
    );
};

export default SubNav;