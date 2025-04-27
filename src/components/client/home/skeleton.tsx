import { FC } from "react";
import { Row, Col, Card, Skeleton } from "antd";

type ListSkeletonProps = {
    count?: number; // Số lượng skeleton item
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
};

const ListCardSkeleton: FC<ListSkeletonProps> = ({
    count = 6,
    xs = 24,
    sm = 12,
    md = 8,
    lg = 6,
    xl = 4,
}) => {
    return (
        <Row gutter={[16, 16]} style={{ transition: "opacity 0.5s ease-in-out" }}>
            {Array.from({ length: count }).map((_, index) => (
                <Col key={index} xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
                    <Card
                        style={{
                            padding: "16px",
                            borderRadius: "12px",
                            height: "100%",
                            background: "linear-gradient(135deg, #f7f7f7, #ececec)",
                        }}
                    >
                        {/* Skeleton Image */}
                        <Skeleton.Image

                            active
                            style={{
                                padding: "0 16px",
                                height: "100px",
                                borderRadius: "10px",
                                marginBottom: "12px",
                            }}
                        />
                        {/* Skeleton Title & Description */}
                        <Skeleton
                            active
                            title={{ width: "70%" }}
                            paragraph={{ rows: 2, width: ["60%", "90%"] }}
                            style={{ width: "100%" }}
                        />
                        {/* Skeleton Button */}
                        <Skeleton.Button
                            active
                            block
                            size="large"
                            style={{
                                marginTop: "12px",
                                height: "40px",
                                borderRadius: "8px",
                                width: "80%",
                            }}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default ListCardSkeleton;