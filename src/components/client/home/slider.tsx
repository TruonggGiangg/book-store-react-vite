import { useEffect, useRef, useState } from 'react';
import { Button, Carousel, Col, Row } from 'antd';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animation/loadingAnimation.json';
import Container from '@/components/layout/client/container.layout';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

type IProps = {
    data: IGetCategories[];
    setData: (v: IGetCategories[] | []) => void;
    loading: boolean;
    dataBook: Record<string, IGetBook[]>;
};

const HomeSlider = ({ data, loading, dataBook }: IProps) => {
    const [scrollY, setScrollY] = useState(0);
    const carouselRef = useRef<any>(null);
    const navigate = useNavigate();

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
                        height: '544px', // Fixed size for layout
                        borderRadius: 8,
                    }}
                >
                    <Lottie
                        animationData={loadingAnimation}
                        loop
                        style={{
                            width: '15%',
                            maxWidth: '200px', // Limit Lottie size
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
                            {/* Category name and description */}
                            <Row
                                style={{
                                    position: 'absolute',
                                    left: '5%',

                                    top: '10%',
                                    color: 'white',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    textShadow: '3px 3px 12px rgba(0, 0, 0, 0.8)',
                                    background: 'linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5))',
                                    padding: '32px 50px',
                                    borderRadius: '10px',
                                    width: '60%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    textAlign: 'left',
                                }}
                            >
                                <Col xs={24} sm={24} md={24}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>
                                        {category.name}
                                    </h2>
                                </Col>
                                <Col xs={24} sm={24} md={24}>
                                    <p
                                        style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.6',
                                            fontWeight: 400,
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 5,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        dangerouslySetInnerHTML={{ __html: category.description }}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} style={{ marginTop: '40px' }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            backgroundColor: '#FF5733',
                                            borderColor: '#FF5733',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease-in-out',
                                        }}
                                        onClick={() => {
                                            navigate(`books/${category._id}`);
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e04c2f')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF5733')}
                                    >
                                        Xem thêm sản phẩm
                                    </Button>
                                </Col>
                            </Row>

                            {/* Book list */}
                            <div
                                style={{
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
                                            onClick={() => {
                                                navigate(`/book/${book._id}`);
                                            }}
                                            style={{
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

                                                    objectFit: 'cover',
                                                    aspectRatio: '2 / 3',
                                                }}
                                            />
                                        </div>

                                    ))
                                ) : (
                                    <div style={{ width: '500px', height: '150px' }} /> // Placeholder
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
