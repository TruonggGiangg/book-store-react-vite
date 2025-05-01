import BookCard from '@/components/client/home/book-card';
import ListCardSkeleton from '@/components/client/home/skeleton';
import Container from '@/components/layout/client/container.layout';
import { getAllBookApi, getAllCategoryApi, getCategoryApi } from '@/services/api';
import { Breadcrumb, Button, Card, Checkbox, Collapse, InputNumber, Row, Select, Slider, Spin, Typography } from 'antd';
const { Text } = Typography;
import Lottie from 'lottie-react';
import React, { useEffect, useState, useCallback } from 'react';
import loadingAnimation from "@/assets/animation/loadingAnimation.json";
import { CaretRightOutlined } from '@ant-design/icons';
import { useAppProvider } from '@/components/context/app.context';
import { useNavigate, useParams } from 'react-router-dom';
import AppBreadcrumb from '@/components/nav/AppBreadcrumb';

interface Filters {
    categories: string[];
    priceRange: [number, number];
    rating: number;
    sortBy: 'priceAsc' | 'priceDesc' | 'newest' | 'bestSelling';
}

const BookPage: React.FC = () => {
    const [filters, setFilters] = useState<Filters>({
        categories: [],
        priceRange: [0, 1000000],
        rating: 0,
        sortBy: 'bestSelling',
    });

    const [appliedFilters, setAppliedFilters] = useState<Filters>({
        categories: [],
        priceRange: [0, 1000000],
        rating: 0,
        sortBy: 'bestSelling',
    });


    const { isDarkTheme } = useAppProvider();
    const { id } = useParams();
    const nav = useNavigate();

    const [dataBook, setDataBook] = useState<IGetBook[]>([]);
    const [listCategories, setDataCategory] = useState<IGetCategories[]>([]);
    const [loadingBook, setLoadingBook] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [allSelected, setAllSelected] = useState<boolean>(true); // Trạng thái chọn tất cả
    const [filterVisible, setFilterVisible] = useState<boolean>(true); // Thêm dòng này

    const [category, setCategory] = useState<IGetCategories | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            if (id) {
                const res = await getCategoryApi(id);
                if (res.data) {
                    setCategory(res.data);
                } else {
                    setCategory(null);
                }
            }
        }
        fetchCategory();
    }, [id]);
    const pageSize = 12;

    useEffect(() => {
        // Cuộn lên đầu trang mỗi khi route thay đổi
        window.scrollTo(0, 0);
    }, []);

    const buildQueryString = (currentFilters: Filters, page: number): string => {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: pageSize.toString(),
            isBook: 'true',
        });

        if (currentFilters.categories.length > 0) {
            params.append('attributes.classification', currentFilters.categories.join(','));
        }

        // if (currentFilters.priceRange[0] > 0) {
        //     params.append('price>=', currentFilters.priceRange[0].toString());
        // }
        // if (currentFilters.priceRange[1] < 1000000) {
        //     params.append('price<=', currentFilters.priceRange[1].toString());
        // }

        // if (currentFilters.rating > 0) {
        //     params.append('rating>=', currentFilters.rating.toString());
        // }

        switch (currentFilters.sortBy) {
            case 'priceAsc':
                params.append('sort', 'price');
                break;
            case 'priceDesc':
                params.append('sort', '-price');
                break;
            case 'newest':
                params.append('sort', '-createdAt');
                break;
            case 'bestSelling':
                params.append('sort', '-sold');
                break;
        }

        return params.toString();
    };

    const fetchBooks = useCallback(
        async (page: number, filtersToUse: Filters, isInitialLoad: boolean = false) => {
            try {
                if (isInitialLoad) setLoadingBook(true);
                else setLoadingMore(true);

                const query = buildQueryString(filtersToUse, page);
                const bookRes = await getAllBookApi(query);

                if (bookRes.data) {
                    const newBooks = bookRes.data.result || [];
                    if (isInitialLoad) {
                        setDataBook(newBooks);
                    } else {
                        setDataBook((prev) => [...prev, ...newBooks]);
                    }
                    setHasMore(newBooks.length === pageSize && newBooks.length > 0);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setHasMore(false);
            } finally {
                if (isInitialLoad) setLoadingBook(false);
                else setLoadingMore(false);
            }
        },
        []
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoadingBook(true);

                // Fetch categories
                const categoryRes = await getAllCategoryApi('isBook=true');
                if (categoryRes.data) {
                    const categories = categoryRes.data.result;
                    setDataCategory(categories);

                    // Extract category ID from URL
                    const url = window.location.pathname; // e.g., /books/67c019e6d2f912a645bb770c
                    const categoryId = url.split('/books/')[1]; // Get the ID after /books/

                    let initialCategories: string[] = [];
                    if (categoryId && categories.some(cat => cat._id === categoryId)) {
                        // If a valid category ID is present, select only that category
                        initialCategories = [categoryId];
                        setAllSelected(false); // Uncheck "All" since a specific category is selected
                    } else {
                        // If no ID or invalid ID, select all categories
                        initialCategories = categories.map((cat) => cat._id);
                        setAllSelected(true); // Check "All"
                    }

                    // Set filters and appliedFilters
                    setFilters((prev) => ({
                        ...prev,
                        categories: initialCategories,
                    }));
                    setAppliedFilters((prev) => ({
                        ...prev,
                        categories: initialCategories,
                    }));

                    // Fetch books with the initial filters
                    await fetchBooks(1, {
                        ...appliedFilters,
                        categories: initialCategories,
                    }, true);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoadingBook(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100 &&
                !loadingMore &&
                hasMore
            ) {
                setCurrentPage((prev) => {
                    const nextPage = prev + 1;
                    fetchBooks(nextPage, appliedFilters);
                    return nextPage;
                });
            }
        };

        if (hasMore) {
            window.addEventListener('scroll', handleScroll);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore, appliedFilters, fetchBooks]);

    const handleFilterChange = (key: keyof Filters, value: any) => {
        if (key === 'categories') {
            const checkedValues = value as string[];
            if (checkedValues.length > 0 && checkedValues.length < listCategories.length) {
                setAllSelected(false); // Bỏ chọn "Tất cả" khi chọn thể loại cụ thể
            } else if (checkedValues.length === listCategories.length) {
                setAllSelected(true); // Chọn lại "Tất cả" khi tất cả thể loại được chọn
            }
        }
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleAllCategoriesChange = (checked: boolean) => {
        setAllSelected(checked);
        if (checked) {
            setFilters((prev) => ({
                ...prev,
                categories: listCategories.map((cat) => cat._id),
            }));
        } else {
            setFilters((prev) => ({ ...prev, categories: [] }));
        }
    };

    const applyFilters = async () => {
        try {
            setLoadingBook(true);
            const newFilters = { ...filters };
            setAppliedFilters(newFilters);
            setCurrentPage(1);
            setDataBook([]);
            setHasMore(true);
            await fetchBooks(1, newFilters, true);
            setFilterVisible(false); // Thêm dòng này để đóng Collapse
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setLoadingBook(false);
        }
    };

    const filterBook = (book: IGetBook) => {
        const { categories, priceRange, rating } = appliedFilters;

        const categoryMatch =
            categories.length === 0 ||
            (book.attributes?.classification &&
                book.attributes.classification.some((cat) => categories.includes(cat)));

        const priceMatch =
            book.price >= priceRange[0] && book.price <= priceRange[1];

        const bookRating = book.rating ?? 0;
        const ratingMatch = bookRating >= rating;

        return categoryMatch && priceMatch && ratingMatch;
    };

    const gridSizes = { xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 };

    return (
        <div style={{ marginTop: "172px" }}>
            <Container>
                <AppBreadcrumb />
                {
                    !id && (
                        <Collapse

                            style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden' }}
                            activeKey={filterVisible ? ['1'] : []} // Thay bằng dòng này
                            onChange={(key) => {
                                setFilterVisible(key.length > 0);
                            }}
                            expandIcon={({ isActive }) => (
                                <CaretRightOutlined
                                    style={{ fontSize: '32px', color: "#ff5733", marginTop: "22px" }} // Điều chỉnh kích thước mũi tên ở đây
                                    rotate={isActive ? 90 : 0}
                                />
                            )}
                            items={[
                                {
                                    key: '1',
                                    label: (

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 600, color: "#ff5733", fontSize: "1.6rem" }}>Bộ lọc sách</Text>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    nav('/tools');
                                                }}
                                            >
                                                Trang dụng cụ
                                            </Button>
                                        </div>

                                    ),

                                    children: (
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ marginBottom: '16px' }}>
                                                <h4>Thể loại</h4>
                                                <Checkbox
                                                    checked={allSelected}
                                                    onChange={(e) => handleAllCategoriesChange(e.target.checked)}
                                                >
                                                    Tất cả
                                                </Checkbox>
                                                <Checkbox.Group
                                                    value={filters.categories}
                                                    onChange={(checkedValues) =>
                                                        handleFilterChange('categories', checkedValues as string[])
                                                    }
                                                >
                                                    {listCategories.map((category) => (
                                                        <Checkbox key={category._id} value={category._id}>
                                                            {category.name || 'Unknown Category'}
                                                        </Checkbox>
                                                    ))}
                                                </Checkbox.Group>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <h4>Khoảng giá</h4>
                                                <Slider
                                                    range
                                                    min={0}
                                                    max={1000000}
                                                    step={10000}
                                                    value={filters.priceRange}
                                                    onChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <InputNumber
                                                        min={0}
                                                        max={filters.priceRange[1]}
                                                        value={filters.priceRange[0]}
                                                        onChange={(value) =>
                                                            handleFilterChange('priceRange', [
                                                                value || 0,
                                                                filters.priceRange[1],
                                                            ])
                                                        }
                                                    />
                                                    <InputNumber
                                                        min={filters.priceRange[0]}
                                                        max={1000000}
                                                        value={filters.priceRange[1]}
                                                        onChange={(value) =>
                                                            handleFilterChange('priceRange', [
                                                                filters.priceRange[0],
                                                                value || 1000000,
                                                            ])
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <h4>Đánh giá tối thiểu</h4>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    value={filters.rating}
                                                    onChange={(value) => handleFilterChange('rating', value as number)}
                                                >
                                                    <Select.Option value={0}>Tất cả</Select.Option>
                                                    <Select.Option value={1}>1 sao trở lên</Select.Option>
                                                    <Select.Option value={2}>2 sao trở lên</Select.Option>
                                                    <Select.Option value={3}>3 sao trở lên</Select.Option>
                                                    <Select.Option value={4}>4 sao trở lên</Select.Option>
                                                </Select>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <h4>Sắp xếp theo</h4>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    value={filters.sortBy}
                                                    onChange={(value) =>
                                                        handleFilterChange('sortBy', value as Filters['sortBy'])
                                                    }
                                                >
                                                    <Select.Option value="priceAsc">Giá tăng dần</Select.Option>
                                                    <Select.Option value="priceDesc">Giá giảm dần</Select.Option>
                                                    <Select.Option value="newest">Mới nhất</Select.Option>
                                                    <Select.Option value="bestSelling">Bán chạy</Select.Option>
                                                </Select>
                                            </div>

                                            <Button type="primary" block onClick={applyFilters} loading={loadingBook}>
                                                Lọc
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    )
                }
                {/* Filter Section with Collapse */}




                <Card size="default" style={{

                    width: "100%",
                    boxShadow: isDarkTheme
                        ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
                        : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
                }}>
                    {
                        id && (
                            <div>

                                <Card style={{ margin: "16px 20px", padding: " 16px" }}>
                                    {category ? (
                                        <>
                                            <Text strong style={{ fontSize: "2rem", color: "#FF5733" }}>
                                                {category.name}
                                            </Text>

                                            <div
                                                style={{
                                                    margin: "16px 0px",
                                                }}
                                                dangerouslySetInnerHTML={{ __html: category.description }}

                                            />
                                        </>
                                    ) : (
                                        <Spin size="large" style={{ margin: "16px 16px" }} />
                                    )}
                                </Card>

                            </div>
                        )
                    }

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ margin: 0, color: "#FF5733" }}>
                            Danh sách sách
                        </h2>

                    </div>
                    {/* Book List Section */}
                    {loadingBook ? (
                        <ListCardSkeleton count={12} />
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                {dataBook.map((x) =>
                                    filterBook(x) ? (
                                        <BookCard
                                            key={x._id.toString()}
                                            book={x}
                                            gridSizes={gridSizes}
                                            listCategories={listCategories}
                                            isBook
                                            showRibbon
                                        />
                                    ) : null
                                )}
                            </Row>
                            {loadingMore && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", height: "200px" }}>
                                    {/* <Lottie animationData={loadingAnimation} loop={true} style={{ width: "20%" }} /> */}
                                    <Spin size="large" />
                                </div>
                            )}
                            {!hasMore && dataBook.length > 0 && (
                                <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '16px', color: '#888' }}>
                                    Đã hiển thị tất cả sách phù hợp
                                </div>
                            )}
                            {!hasMore && dataBook.length === 0 && (
                                <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '16px', color: '#888' }}>
                                    Không tìm thấy sách nào phù hợp
                                </div>
                            )}
                        </>
                    )}
                </Card>

            </Container>
        </div >
    );
};

export default BookPage;