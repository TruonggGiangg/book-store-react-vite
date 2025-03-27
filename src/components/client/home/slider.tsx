import { useEffect, useState } from 'react';
import { Button, Carousel } from 'antd';

import Lottie from 'lottie-react';
import loadingAnimation from "@/assets/animation/loadingAnimation.json"
import Container from '@/components/layout/client/container.layout';

type IProps = {
    data: IGetCategories[],
    setData: (v: IGetCategories[] | []) => void,
    loading: boolean,
    dataBook: Record<string, IGetBook[]>
}

const HomeSlider = (props: IProps) => {
    const { data, loading, dataBook } = props;
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", height: "500px" }}>
                <Lottie animationData={loadingAnimation} loop={true} style={{ width: "20%" }} />
            </div>
        );
    }

    return (
        <Container>
            <Carousel arrows effect="scrollx" style={{ borderRadius: 8, overflow: "hidden" }}>
                {data.map((category, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "600px",
                                backgroundImage: `url(${import.meta.env.VITE_BACKEND_URL}/images/category/${category.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                filter: "brightness(70%)", // Làm tối ảnh để chữ nổi bật hơn
                                transition: "transform 0.5s ease-in-out, opacity 0.3s ease-in-out",

                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.025)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >

                            {/* Tên thể loại */}
                            <div style={{
                                position: "absolute",
                                left: "5%",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "white",
                                fontSize: "32px",
                                fontWeight: "bold",
                                textShadow: "3px 3px 12px rgba(0, 0, 0, 0.8)",
                                background: "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5))",
                                padding: "32px 50px",
                                borderRadius: "10px",
                                width: "45%",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                textAlign: "left",
                                flexDirection: "column",
                            }}>
                                <h2 style={{ fontSize: "3.2rem", marginBottom: "10px", fontWeight: 500 }}>{category.name}</h2>
                                <p style={{
                                    fontSize: "1rem",
                                    lineHeight: "1.6",
                                    fontWeight: 400,
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 6,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }} dangerouslySetInnerHTML={{ __html: category.description as string }} >{ }</p>
                                <div style={{ marginTop: "40px", display: "flex", gap: "1.5rem" }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            backgroundColor: "#FF5733",
                                            borderColor: "#FF5733",
                                            fontWeight: "bold",
                                            transition: "all 0.3s ease-in-out",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e04c2f")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF5733")}
                                    >
                                        Xem thêm sản phẩm
                                    </Button>

                                </div>
                            </div>

                            {/* Danh sách sách theo danh mục */}
                            <div style={{
                                textAlign: "left",
                                display: "flex",
                                gap: "15px",
                                position: "absolute",
                                bottom: "32px",
                                right: "48px",
                                height: "150px",
                            }}>
                                {dataBook[category._id]?.length > 0 ? (
                                    dataBook[category._id].slice(0, 5).map((book) => ( // Giới hạn tối đa 5 sách
                                        <div key={book._id} style={{
                                            width: "100px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "8px",
                                            color: "white",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                                            cursor: "pointer",

                                        }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                        >
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                                                alt={book.title}
                                                style={{
                                                    width: "100px",
                                                    height: "150px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                    padding: "4px",
                                                    overflow: "hidden",
                                                }}
                                            />

                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </Container>


    );
};

export default HomeSlider;
