import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { getAllCategoryApi } from '@/services/api';

const HomeSlider: React.FC = () => {
    const [dataCategory, setDataCategory] = useState<IGetCategories[]>([]);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Opacity giảm dần từ 1 -> 0 khi cuộn xuống 400px
    const opacity = Math.max(0, 1 - scrollY / 400);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllCategoryApi();
                if (res.data) {
                    setDataCategory(res.data.result);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchData();
    }, []);

    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };

    return (
        <Carousel arrows afterChange={onChange} effect='fade'>
            {dataCategory.map((x, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/category/${x.image}`}
                        alt={x.name || "category"}
                        style={{
                            width: "100%",
                            height: "500px",
                            objectFit: "cover",
                            opacity: opacity,
                            transition: "opacity 0.3s ease-in-out",
                        }}
                    />
                </div>
            ))}
        </Carousel>
    );
};

export default HomeSlider;
