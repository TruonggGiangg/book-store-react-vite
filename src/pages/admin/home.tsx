import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, ConfigProvider, Empty } from "antd";
import {
    ShoppingOutlined,
    ClockCircleOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { Pie, Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { useAppProvider } from "@/components/context/app.context";
import { getAllOrderApi } from "@/services/api";
import { Link } from "react-router-dom";

// Define VND formatter
const vndFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
});


const HomePageAdmin = () => {
    const { currUser } = useAppProvider();

    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        thisMonth: 0,
        pending: 0,
    });

    const [revenueStats, setRevenueStats] = useState({
        day: 0,
        month: 0,
        year: 0,
    });

    const [topBooks, setTopBooks] = useState<{ name: string; value: number }[]>([]);
    const [last7DaysRevenue, setLast7DaysRevenue] = useState<
        { date: string; value: number }[]
    >([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAllOrderApi("current=1&pageSize=1000");
                const orders: IGetOrder[] = res.data?.result || [];

                if (!orders.length) {
                    console.warn("No orders found in API response");
                    return;
                }

                const today = dayjs();
                const thisMonth = today.format("YYYY-MM");
                const thisYear = today.format("YYYY");

                let dayRevenue = 0;
                let monthRevenue = 0;
                let yearRevenue = 0;
                const bookCountMap = new Map<string, number>();
                const dailyRevenueMap = new Map<string, number>();

                // Initialize last 7 days (D to D-6)
                for (let i = 0; i < 7; i++) {
                    const date = today.subtract(i, "day").format("YYYY-MM-DD");
                    dailyRevenueMap.set(date, 0);
                }

                const todayOrders = orders.filter(
                    (o) => dayjs(o.createdAt).format("YYYY-MM-DD") === today.format("YYYY-MM-DD")
                );

                orders.forEach((order) => {
                    const orderDate = dayjs(order.createdAt);
                    const orderRevenue = order.totalAmount || 0;
                    const orderDateStr = orderDate.format("YYYY-MM-DD");

                    // Aggregate revenue for today, month, year
                    if (orderDateStr === today.format("YYYY-MM-DD")) {
                        dayRevenue += orderRevenue;
                    }
                    if (orderDate.format("YYYY-MM") === thisMonth) {
                        monthRevenue += orderRevenue;
                    }
                    if (orderDate.format("YYYY") === thisYear) {
                        yearRevenue += orderRevenue;
                    }

                    // Aggregate revenue for last 7 days
                    if (dailyRevenueMap.has(orderDateStr)) {
                        dailyRevenueMap.set(
                            orderDateStr,
                            (dailyRevenueMap.get(orderDateStr) || 0) + orderRevenue
                        );
                    }

                    // Aggregate book quantities
                    if (order.items && order.items.length > 0) {
                        order.items.forEach((item: IOrderItem) => {
                            const name = item.name && item.name.trim() ? item.name : "Không rõ";
                            const quantity = item.quantity || 0;
                            if (quantity > 0) {
                                bookCountMap.set(
                                    name,
                                    (bookCountMap.get(name) || 0) + quantity
                                );
                            }
                        });
                    }
                });

                // Prepare top books
                const sortedTopBooks = Array.from(bookCountMap.entries())
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5);

                // Prepare last 7 days revenue data
                const last7DaysData = Array.from(dailyRevenueMap.entries())
                    .map(([date, value]) => ({
                        date: dayjs(date).format("DD/MM"),
                        value,
                    }))
                    .sort((a, b) => dayjs(a.date, "DD/MM").diff(dayjs(b.date, "DD/MM")));

                console.log("Top books:", sortedTopBooks);
                console.log("Last 7 days revenue:", last7DaysData);

                setStats({
                    total: orders.length,
                    today: todayOrders.length,
                    thisMonth: orders.filter(
                        (o) => dayjs(o.createdAt).format("YYYY-MM") === thisMonth
                    ).length,
                    pending: orders.filter((o) => o.status === "pending").length,
                });

                setRevenueStats({
                    day: dayRevenue,
                    month: monthRevenue,
                    year: yearRevenue,
                });

                setTopBooks(sortedTopBooks);
                setLast7DaysRevenue(last7DaysData);
            } catch (error) {
                console.error("Lỗi khi lấy thống kê:", error);
            }
        };

        fetchStats();
    }, []);

    // Column chart configuration (Day/Month/Year)
    const columnConfig = {
        data: [
            { type: "Hôm nay", value: revenueStats.day },
            { type: "Tháng này", value: revenueStats.month },
            { type: "Năm nay", value: revenueStats.year },
        ],
        xField: "type",
        yField: "value",
        columnStyle: {
            radius: [10, 10, 0, 0],
            fill: "#1890ff",
            fillOpacity: 0.85,
        },
        color: ["#1890ff", "#13c2c2", "#52c41a"],
        label: {
            position: "middle",
            style: {
                fill: "#fff",
                fontSize: 12,
                fontWeight: "bold",
            },
            formatter: (datum: any) => vndFormatter.format(datum.value),
        },
        xAxis: {
            label: {
                style: { fontSize: 14, fontWeight: 500 },
            },
        },
        yAxis: {
            label: {
                formatter: (v: number) => vndFormatter.format(v),
            },
        },
        animation: {
            appear: {
                animation: "fade-in",
                duration: 600,
            },
        },
    };

    // Last 7 days revenue chart configuration
    const last7DaysColumnConfig = {
        data: last7DaysRevenue,
        xField: "date",
        yField: "value",
        columnStyle: {
            radius: [10, 10, 0, 0],
            fill: "#13c2c2",
            fillOpacity: 0.85,
        },
        label: {
            position: "middle",
            style: {
                fill: "#fff",
                fontSize: 12,
                fontWeight: "bold",
            },
            formatter: (datum: any) => vndFormatter.format(datum.value),
        },
        xAxis: {
            label: {
                style: { fontSize: 14, fontWeight: 500 },
            },
        },
        yAxis: {
            label: {
                formatter: (v: number) => vndFormatter.format(v),
            },
        },
        animation: {
            appear: {
                animation: "fade-in",
                duration: 600,
            },
        },
    };

    // Pie chart configuration
    const pieConfig = {
        data: topBooks.length > 0 ? topBooks : [{ name: "Không có dữ liệu", value: 1 }],
        angleField: "value",
        colorField: "name",
        radius: 0.9,
        innerRadius: 0.6,
        color: topBooks.length > 0 ? ["#1890ff", "#13c2c2", "#52c41a", "#fa8c16", "#fadb14"] : ["#d9d9d9"],
        label: {
            type: "outer",
            content: "{name}: {value}",
            style: {
                fontSize: 12,
                fontWeight: 500,
            },
        },
        interactions: [
            { type: "element-active" },
            { type: "pie-legend-active" },
        ],
        statistic: {
            title: {
                content: "Tổng sách",
                style: { fontSize: 14, color: "#595959" },
            },
            content: {
                content: topBooks.reduce((sum, book) => sum + book.value, 0).toString(),
                style: { fontSize: 18, fontWeight: "bold", color: "#1890ff" },
            },
        },
        animation: {
            appear: {
                animation: "zoom-in",
                duration: 600,
            },
        },
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Card: {
                        borderRadiusLG: 12,
                        boxShadow:
                            "0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.08)",
                    },
                    Statistic: {
                        titleFontSize: 14,
                        contentFontSize: 24,
                        colorText: "#1f1f1f",
                    },
                },
            }}
        >
            <div style={{ padding: "24px", minHeight: "100vh" }}>
                <h1 style={{ fontSize: 28, marginBottom: 24 }}>
                    Chào {currUser?.name || "Admin"} 👋
                </h1>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Link to="/admin/order">

                            <Card hoverable>
                                <Statistic
                                    title="Tổng đơn hàng hôm nay"
                                    value={stats.today}
                                    prefix={<ShoppingOutlined style={{ color: "#1890ff" }} />}
                                />

                            </Card>

                        </Link>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Link to="/admin/order">
                            <Card hoverable>
                                <Statistic
                                    title="Đơn chờ xử lý"
                                    value={stats.pending}
                                    prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
                                />
                            </Card>
                        </Link>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable>
                            <Statistic
                                title="Doanh thu hôm nay"
                                value={revenueStats.day}
                                formatter={(value) => vndFormatter.format(value as number)}
                                prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable>
                            <Statistic
                                title="Doanh thu tháng này"
                                value={revenueStats.month}
                                formatter={(value) => vndFormatter.format(value as number)}
                                prefix={<DollarOutlined style={{ color: "#13c2c2" }} />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={24}>
                        <Card
                            title="Biểu đồ doanh thu (Ngày / Tháng / Năm)"
                            hoverable
                            style={{ borderRadius: 12 }}
                        >
                            <Column  {...columnConfig} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={24}>
                        <Card
                            title="Doanh thu 7 ngày gần nhất"
                            hoverable
                            style={{ borderRadius: 12 }}
                        >
                            {last7DaysRevenue.length > 0 ? (
                                <Column {...last7DaysColumnConfig} />
                            ) : (
                                <Empty description="Không có dữ liệu doanh thu" />
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </ConfigProvider>
    );
};

export default HomePageAdmin;