import { useEffect, useRef, useState } from 'react';
import { Button, Carousel } from 'antd';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animation/loadingAnimation.json';
import Container from '@/components/layout/client/container.layout';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

type IProps = {
    data: IGetCategories[];
    setData: (v: IGetCategories[] | []) => void;
    loading: boolean;
    dataBook: Record<string, IGetBook[]>;
};

const HomeSlider = ({ data, loading, dataBook }: IProps) => {
    const [scrollY, setScrollY] = useState(0);
    const carouselRef = useRef<any>(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <Container>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '544px', // Kích thước cố định để tránh dịch layout
                        borderRadius: 8,

                    }}
                >
                    <Lottie
                        animationData={loadingAnimation}
                        loop
                        style={{
                            width: '15%',
                            maxWidth: '200px', // Giới hạn kích thước Lottie
                            height: 'auto',
                            margin: 'auto',
                        }}
                    />
                </div>
            </Container>
        );
    }

    const prevArrow = (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                fontSize: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 1,
                left: 12,
            }}
            onClick={() => carouselRef.current?.prev()}
        >
            <LeftOutlined />
        </div>
    );

    const nextArrow = (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                fontSize: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 1,
                right: 12,
            }}
            onClick={() => carouselRef.current?.next()}
        >
            <RightOutlined />
        </div>
    );

    return (
        <div style={{ position: 'relative' }}>
            {prevArrow}
            {nextArrow}
            <Carousel
                ref={carouselRef}
                autoplay
                dots
                arrows={false}
                effect="scrollx"
                style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    height: '600px', // Kích thước cố định
                    width: '100%',
                }}
            >
                {data.map((category, i) => (
                    <div key={i} style={{ height: '600px' }}>
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '600px',
                                backgroundImage: `url(${import.meta.env.VITE_BACKEND_URL}/images/category/${category.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                filter: 'brightness(70%)',
                                transition: 'transform 0.5s ease-in-out',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.025)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {/* Tên thể loại */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '5%',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'white',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    textShadow: '3px 3px 12px rgba(0, 0, 0, 0.8)',
                                    background: 'linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5))',
                                    padding: '32px 50px',
                                    borderRadius: '10px',
                                    width: '45%',
                                    minHeight: '300px', // Đảm bảo kích thước tối thiểu
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    textAlign: 'left',
                                }}
                            >
                                <h2 style={{ fontSize: '3.2rem', marginBottom: '10px', fontWeight: 500 }}>
                                    {category.name}
                                </h2>
                                <p
                                    style={{
                                        fontSize: '1rem',
                                        lineHeight: '1.6',
                                        fontWeight: 400,
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 6,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {category.description} {/* Tránh dangerouslySetInnerHTML */}
                                </p>
                                <div style={{ marginTop: '40px', display: 'flex', gap: '1.5rem' }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            backgroundColor: '#FF5733',
                                            borderColor: '#FF5733',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease-in-out',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e04c2f')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF5733')}
                                    >
                                        Xem thêm sản phẩm
                                    </Button>
                                </div>
                            </div>

                            {/* Danh sách sách theo danh mục */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '15px',
                                    position: 'absolute',
                                    bottom: '32px',
                                    right: '48px',
                                    height: '150px',
                                    overflow: 'hidden',
                                }}
                            >
                                {dataBook[category._id]?.length > 0 ? (
                                    dataBook[category._id].slice(0, 5).map((book) => (
                                        <div
                                            key={book._id}
                                            style={{
                                                width: '100px',
                                                height: '150px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                transition: 'transform 0.3s ease-in-out',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                        >
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                                                alt={book.title}
                                                style={{
                                                    width: '100px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                    padding: '4px',
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ width: '500px', height: '150px' }} /> // Placeholder để giữ không gian
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HomeSlider;