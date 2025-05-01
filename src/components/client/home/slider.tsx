import { useEffect, useRef, useState } from 'react';
import { Button, Carousel, Col, Grid, Row } from 'antd';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animation/loadingAnimation.json';
import Container from '@/components/layout/client/container.layout';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

type IProps = {
    data: IGetCategories[];
    setData: (v: IGetCategories[] | []) => void;
    loading: boolean;
    dataBook: Record<string, IGetBook[]>;
};

const HomeSlider = ({ data, loading, dataBook }: IProps) => {
    const [scrollY, setScrollY] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // State mới để kiểm soát loading
    const carouselRef = useRef<any>(null);
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!loading) {
            // Đợi ít nhất 4 giây trước khi tắt loading
            timer = setTimeout(() => {
                setIsLoading(false);
            }, 4000);
        } else {
            setIsLoading(true);
        }
        return () => clearTimeout(timer); // Cleanup timer
    }, [loading]);

    if (isLoading) {
        return (
            <Container>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '544px',
                        borderRadius: 8,

                        border: '1px solid #ddd',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Lottie
                        animationData={loadingAnimation}
                        loop
                        style={{
                            width: '15%',
                            maxWidth: '200px',
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
                    height: '600px',
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
                            <div
                                style={{
                                    position: 'absolute',
                                    top: screens.xs ? '12%' : '40%',
                                    transform: 'translateY(-50%)',
                                    left: '5%',
                                    color: 'white',
                                    width: screens.xs ? '90%' : '60%',
                                    padding: '24px',
                                    background: screens.xs ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.5)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',

                                        justifyContent: 'left',
                                        alignItems: 'center',
                                        width: screens.xs ? '40%' : '100%',
                                    }}
                                >
                                    <h2 style={{ fontSize: screens.xs ? '1.5rem' : '2.5rem' }}>{category.name}</h2>
                                </div>


                                {!screens.xs && (
                                    <p
                                        style={{
                                            marginTop: 12,
                                            fontSize: '1rem',
                                            lineHeight: 1.6,
                                            maxHeight: 120,
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 4,
                                            WebkitBoxOrient: 'vertical',
                                            width: '100%',
                                        }}
                                        dangerouslySetInnerHTML={{ __html: category.description }}
                                    />
                                )}

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'right',
                                        alignItems: 'center',

                                        width: screens.xs ? '40%' : '100%',
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        size={screens.xs ? 'middle' : 'large'}
                                        icon={screens.xs ? <EyeOutlined /> : undefined}
                                        style={{

                                            backgroundColor: '#FF5733',
                                            borderColor: '#FF5733',
                                            fontWeight: 'bold',
                                        }}
                                        onClick={() => navigate(`books/${category._id}`)}
                                    >
                                        Xem thêm
                                    </Button>
                                </div>

                            </div>

                            {dataBook[category._id]?.length > 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 32,
                                        right: 32,
                                        display: 'flex',
                                        gap: 16,
                                    }}
                                >
                                    {dataBook[category._id]
                                        .slice(0, screens.xs ? 2 : 4)
                                        .map((book) => (
                                            <img
                                                key={book._id}
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                                                alt={book.title}
                                                onClick={() => navigate(`/book/${book._id}`)}
                                                style={{
                                                    width: 100,
                                                    aspectRatio: '2 / 3',
                                                    objectFit: 'cover',
                                                    borderRadius: 8,
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                            />
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))
                }
            </Carousel >
        </div >
    );
};

export default HomeSlider;