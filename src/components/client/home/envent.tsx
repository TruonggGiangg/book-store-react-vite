import Container from "@/components/layout/client/container.layout"
import { Button, Card, Col, Row, Skeleton } from "antd";
import { Link } from "react-router-dom";


type IProps = {
    dataEvent: IGetEvent[];
    loading: boolean;
}


const EventHome = (props: IProps) => {

    const { dataEvent, loading } = props;


    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600 }}>Sự kiện</h2>
                <Button type="link" style={{ fontSize: "14px", color: "#FF5733" }}>Xem tất cả</Button>
            </div>

            <Card>
                <Row gutter={[16, 16]} style={{ minHeight: "300px" }}>
                    {loading ? (
                        <Col span={24} style={{ textAlign: "center", minHeight: "300px" }}>
                            <Skeleton active />
                            <Skeleton active />
                        </Col>
                    ) : (


                        dataEvent.map((event, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <Card

                                    hoverable
                                    cover={
                                        <img
                                            alt={event.name}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/event/${event.image}`}
                                            style={{ height: 200, objectFit: "cover" }}
                                        />
                                    }
                                    style={{ borderRadius: 8 }}
                                >
                                    <Card.Meta

                                        description={
                                            <span
                                                style={{
                                                    minHeight: 48,
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    WebkitLineClamp: 2,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",

                                                }}
                                                dangerouslySetInnerHTML={{ __html: event.description as string }}
                                            >
                                                { }
                                            </span>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))



                    )}
                </Row>
            </Card>


        </>
    )

}

export default EventHome