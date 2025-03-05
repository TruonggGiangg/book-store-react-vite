import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { PageLoading } from '@ant-design/pro-components';

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

    // Opacity giảm dần từ 1 -> 0 khi cuộn xuống 400px
    const opacity = Math.max(0, 1 - scrollY / 400);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", height: "500px" }}>
                <PageLoading />
            </div>
        );
    }

    return (
        <Carousel arrows effect="scrollx">
            {data.map((category, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", width: "100%", height: "500px" }}>
                        {/* Ảnh lớn */}
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/category/${category.image}`}
                            alt={category.name || "category"}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: opacity,
                                transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />

                        {/* Danh sách sách theo danh mục */}
                        <div style={{

                            textAlign: "left",
                            display: "flex",
                            gap: "10px",

                            position: "absolute",
                            bottom: "12px",
                            right: "12px",
                            height: "172px"
                        }}>
                            {dataBook[category._id]?.length > 0 ? (
                                dataBook[category._id].slice(0, 5).map((book) => ( // Giới hạn tối đa 5 sách
                                    <div key={book._id} style={{
                                        width: '100px',
                                        display: "flex",
                                        flexDirection: 'column',
                                        gap: "10px",
                                        color: "white",
                                        borderRadius: "5px",
                                        overflow: 'hidden',
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
                                        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                                        opacity: opacity,
                                        cursor: "pointer",
                                    }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                                            alt={book.title}
                                            style={{ width: "100px", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <>
                                </>
                            )}

                        </div>

                    </div>
                </div>
            ))}
        </Carousel>
    );
};

export default HomeSlider;
