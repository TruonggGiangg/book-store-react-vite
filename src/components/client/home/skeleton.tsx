import { FC } from "react";
import { Row, Col, Card, Skeleton } from "antd";
import { useAppProvider } from "@/components/context/app.context";

type ListSkeletonProps = {
    count?: number; // Số lượng skeleton item
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
};

const ListCardSkeleton: FC<ListSkeletonProps> = ({
    count = 6,
    xxl = 4, xl = 6, lg = 6, md = 8, sm = 12, xs = 24
}) => {
    const { isDarkTheme } = useAppProvider();

    // Định nghĩa màu sắc tùy theo chế độ sáng/tối
    const backgroundColor = isDarkTheme ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
    const skeletonColor = isDarkTheme ? "#333" : "#fff";
    const skeletonButtonColor = isDarkTheme ? "#444" : "#FF5733"; // Màu nút theo chủ đạo

    return (
        <Row gutter={[16, 16]} style={{ transition: "opacity 0.5s ease-in-out" }}>
            {Array.from({ length: count }).map((_, index) => (
                <Col key={index} xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
                    <Card
                        style={{
                            padding: "16px",
                            borderRadius: "16px",
                            height: "530px",
                            background: backgroundColor, // Background thay đổi theo Dark Mode
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", // Hiệu ứng nổi nhẹ
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        {/* Skeleton Image */}
                        <Skeleton.Image
                            active
                            style={{
                                width: "100%",
                                height: "250px",
                                borderRadius: "12px",
                                marginBottom: "16px",
                                backgroundColor: skeletonColor, // Background image khi dark mode
                            }}
                        />

                        {/* Skeleton Title & Description */}
                        <Skeleton
                            active
                            title={{ width: "60%" }}
                            paragraph={{ rows: 3, width: ["80%", "100%"] }}
                            style={{ width: "100%", marginBottom: "16px" }}
                        />

                        {/* Skeleton Button */}
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Skeleton.Button
                                active
                                block
                                size="default"
                                style={{
                                    height: "45px",
                                    borderRadius: "10px",
                                    backgroundColor: skeletonColor, // Nút mặc định
                                }}
                            />
                            <Skeleton.Button
                                active
                                block
                                size="default"
                                style={{
                                    height: "45px",
                                    borderRadius: "10px",
                                    backgroundColor: skeletonButtonColor, // Màu nút theo chế độ tối/sáng
                                    opacity: 0.7,
                                }}
                            />
                        </div>

                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default ListCardSkeleton;
