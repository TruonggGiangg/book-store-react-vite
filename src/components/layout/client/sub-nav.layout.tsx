import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { Button, Dropdown, Spin, Space, Typography, Grid } from "antd";
import { DownOutlined, BookOutlined, ToolOutlined } from "@ant-design/icons";
import { useAppProvider } from "../../context/app.context";
import { getAllCategoryApi, getAllEventApi, getCategoryApi } from "@/services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SubNav: React.FC = () => {
    const { isDarkTheme } = useAppProvider();
    const { t } = useTranslation("global");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const screens = Grid.useBreakpoint();

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
                .then(res => setCategoryDesc(res.data?.data?.description || null))
                .catch(() => setCategoryDesc(null));
        } else {
            setCategoryDesc(null);
        }
    }, [id]);

    const books = useMemo(() => categories.filter(cat => cat.isBook), [categories]);
    const tools = useMemo(() => categories.filter(cat => !cat.isBook), [categories]);

    const booksMenu = books.map(cat => ({
        key: cat._id,
        label: cat.name,
        onClick: () => navigate(`/books/${cat._id}`),
    }));

    const toolsMenu = tools.map(cat => ({
        key: cat._id,
        label: cat.name,
        onClick: () => navigate(`/tools/${cat._id}`),
    }));

    const eventsMenu = events.length
        ? events.map(e => ({
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
        // backgroundColor: active ? "#1677ff" : isDarkTheme ? "#2a2a2a" : "#fff",
        color: active ? "#fff" : isDarkTheme ? "#e5e7eb" : "#1f2937",
        fontWeight: active ? 600 : 400,
        fontSize: screens.lg ? "16px" : "14px",
        borderRadius: 6,
        border: isDarkTheme ? "1px solid #444" : "1px solid #d9d9d9",
        transition: "all 0.2s",
    });

    return (
        <div style={{ width: "100%", height: 30, display: "flex", alignItems: "center", position: "relative" }}>
            <div style={{ maxWidth: 1200, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 auto" }}>
                <Space size={screens.lg ? 12 : 8}>
                    <Dropdown menu={{ items: booksMenu }} trigger={["hover"]}>
                        <Button type="text" style={{ color: isDarkTheme ? "#e5e7eb" : "#1f2937", fontWeight: 500 }}>
                            Thể loại sách <DownOutlined />
                        </Button>
                    </Dropdown>
                    <Dropdown menu={{ items: toolsMenu }} trigger={["hover"]}>
                        <Button type="text" style={{ color: isDarkTheme ? "#e5e7eb" : "#1f2937", fontWeight: 500 }}>
                            Loại dụng cụ <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>

                <Space size={screens.lg ? 12 : 8}>
                    <Button
                        type="primary"
                        icon={<BookOutlined />}
                        style={buttonStyle(isBook)}
                        onClick={() => handleToggle(true)}
                    >
                        Tất cả sách
                    </Button>
                    <Button
                        type={!isBook ? "primary" : "default"}
                        icon={<ToolOutlined />}
                        style={buttonStyle(!isBook)}
                        onClick={() => handleToggle(false)}
                    >
                        Tất cả dụng cụ
                    </Button>
                </Space>

                <Dropdown menu={{ items: eventsMenu }} trigger={["hover"]}>
                    <Button type="text" style={{ color: isDarkTheme ? "#e5e7eb" : "#1f2937", fontWeight: 500 }}>
                        Sự kiện <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            {categoryDesc && (
                <Typography.Paragraph
                    style={{
                        position: "absolute",
                        top: 30,
                        left: 0,
                        right: 0,
                        margin: "8px auto 0",
                        fontSize: screens.lg ? 15 : 14,

                        fontStyle: "italic",
                        maxWidth: 1200,
                        textAlign: "center",

                        zIndex: 998,
                    }}
                >
                    {categoryDesc}
                </Typography.Paragraph>
            )}

            {loading && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        zIndex: 1000,
                    }}
                >
                    <Spin size="small" />
                </div>
            )}
        </div>
    );
};

export default SubNav;
