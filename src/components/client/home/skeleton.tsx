import { FC } from "react";
import { Row, Col, Card, Skeleton } from "antd";

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
    return (
        <Row gutter={[16, 16]} style={{ transition: "opacity 0.5s ease-in-out" }}>
            {Array.from({ length: count }).map((_, index) => (
                <Col key={index} xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
                    <Card
                        style={{
                            padding: "16px",
                            borderRadius: "16px",
                            height: "530px",
                            background: "rgba(255, 255, 255, 0.8)", // Glassmorphism
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", // Hiệu ứng nổi nhẹ
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "center",
                            width: "100%"
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

                                }}
                            />
                            <Skeleton.Button
                                active
                                block
                                size="default"
                                style={{
                                    height: "45px",
                                    borderRadius: "10px",

                                    background: "#FF5733", // Màu chủ đạo
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
