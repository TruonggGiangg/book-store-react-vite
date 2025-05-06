import BookCard from '@/components/client/home/book-card';
import ListCardSkeleton from '@/components/client/home/skeleton';
import Container from '@/components/layout/client/container.layout';
import { getAllBookApi, getAllCategoryApi, getCategoryApi } from '@/services/api';
import { Breadcrumb, Button, Card, Checkbox, Collapse, InputNumber, Row, Select, Slider, Typography } from 'antd';
const { Text } = Typography;
import Lottie from 'lottie-react';
import React, { useEffect, useState, useCallback } from 'react';
import loadingAnimation from "@/assets/animation/loadingAnimation.json";
import { CaretRightOutlined, HomeOutlined } from '@ant-design/icons';
import { useAppProvider } from '@/components/context/app.context';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppBreadcrumb from '@/components/nav/AppBreadcrumb';

interface Filters {
    categories: string[];
    priceRange: [number, number];
    rating: number;
    sortBy: 'priceAsc' | 'priceDesc' | 'newest' | 'bestSelling';
}

const ToolPage: React.FC = () => {
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

    const [dataTool, setDataTool] = useState<IGetBook[]>([]);
    const [listCategories, setDataCategory] = useState<IGetCategories[]>([]);
    const [loadingTool, setLoadingTool] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [allSelected, setAllSelected] = useState<boolean>(true);
    const [filterVisible, setFilterVisible] = useState<boolean>(true);
    const [category, setCategory] = useState<IGetCategories | null>(null);
    const pageSize = 6;

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

    const buildQueryString = (currentFilters: Filters, page: number): string => {
        const params = new URLSearchParams({
            current: page.toString(),
            pageSize: pageSize.toString(),
            isBook: 'false',
        });

        if (currentFilters.categories.length > 0) {
            params.append('attributes.classification', currentFilters.categories.join(','));
        }

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

    const fetchTools = useCallback(
        async (page: number, filtersToUse: Filters, isInitialLoad: boolean = false) => {
            try {
                if (isInitialLoad) setLoadingTool(true);
                else setLoadingMore(true);

                const query = buildQueryString(filtersToUse, page);
                const toolRes = await getAllBookApi(query);

                if (toolRes.data) {
                    const newTools = toolRes.data.result || [];
                    if (isInitialLoad) {
                        setDataTool(newTools);
                    } else {
                        setDataTool((prev) => [...prev, ...newTools]);
                    }
                    setHasMore(newTools.length === pageSize && newTools.length > 0);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching tools:', error);
                setHasMore(false);
            } finally {
                if (isInitialLoad) setLoadingTool(false);
                else setLoadingMore(false);
            }
        },
        []
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoadingTool(true);

                // Fetch categories
                const categoryRes = await getAllCategoryApi('isBook=false');
                if (categoryRes.data) {
                    const categories = categoryRes.data.result;
                    setDataCategory(categories);

                    // Extract category ID from URL
                    const url = window.location.pathname;
                    const categoryId = url.split('/tools/')[1];

                    let initialCategories: string[] = [];
                    if (categoryId && categories.some(cat => cat._id === categoryId)) {
                        initialCategories = [categoryId];
                        setAllSelected(false);
                    } else {
                        initialCategories = categories.map((cat) => cat._id);
                        setAllSelected(true);
                    }

                    setFilters((prev) => ({
                        ...prev,
                        categories: initialCategories,
                    }));
                    setAppliedFilters((prev) => ({
                        ...prev,
                        categories: initialCategories,
                    }));

                    await fetchTools(1, {
                        ...appliedFilters,
                        categories: initialCategories,
                    }, true);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoadingTool(false);
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
                    fetchTools(nextPage, appliedFilters);
                    return nextPage;
                });
            }
        };

        if (hasMore) {
            window.addEventListener('scroll', handleScroll);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore, appliedFilters, fetchTools]);

    const handleFilterChange = (key: keyof Filters, value: any) => {
        if (key === 'categories') {
            const checkedValues = value as string[];
            if (checkedValues.length > 0 && checkedValues.length < listCategories.length) {
                setAllSelected(false);
            } else if (checkedValues.length === listCategories.length) {
                setAllSelected(true);
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
            setLoadingTool(true);
            const newFilters = { ...filters };
            setAppliedFilters(newFilters);
            setCurrentPage(1);
            setDataTool([]);
            setHasMore(true);
            await fetchTools(1, newFilters, true);
            setFilterVisible(false);
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setLoadingTool(false);
        }
    };

    const filterTool = (tool: IGetBook) => {
        const { categories, priceRange, rating } = appliedFilters;

        const categoryMatch =
            categories.length === 0 ||
            (tool.attributes?.classification &&
                tool.attributes.classification.some((cat) => categories.includes(cat)));

        const priceMatch =
            tool.price >= priceRange[0] && tool.price <= priceRange[1];

        const toolRating = tool.rating ?? 0;
        const ratingMatch = toolRating >= rating;

        return categoryMatch && priceMatch && ratingMatch;
    };

    const gridSizes = { xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 };

    return (
        <div style={{ marginTop: "172px" }}>
            <Container>
                <Breadcrumb style={{ marginBottom: "16px" }}>
                    <Breadcrumb.Item>
                        <Link to="/">
                            <HomeOutlined />
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/books">Dụng cụ</a>
                    </Breadcrumb.Item>

                    {category && (
                        <Breadcrumb.Item>
                            {category.name || "Loại dụng cụ"}
                        </Breadcrumb.Item>
                    )}

                </Breadcrumb>
                {
                    !id && (

                        <Collapse
                            style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden' }}
                            activeKey={filterVisible ? ['1'] : []}
                            onChange={(key) => {
                                setFilterVisible(key.length > 0);
                            }}
                            expandIcon={({ isActive }) => (
                                <CaretRightOutlined
                                    style={{ fontSize: '32px', color: "#ff5733", marginTop: "22px" }}
                                    rotate={isActive ? 90 : 0}
                                />
                            )}
                            items={[
                                {
                                    key: '1',
                                    label: (

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 600, color: "#ff5733", fontSize: "1.6rem" }}>Bộ lọc dụng cụ</Text>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    nav('/books');
                                                }}
                                            >
                                                Trang sách
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

                                            <Button type="primary" block onClick={applyFilters} loading={loadingTool}>
                                                Lọc
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    )}

                <Card size="default" style={{
                    width: "100%",
                    boxShadow: isDarkTheme
                        ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
                        : "0px 0px 12px rgba(0, 0, 0, 0.1)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ margin: 0, color: "#FF5733" }}>
                            Danh sách dụng cụ
                        </h2>
                        <Button type="link" style={{ color: "#FF5733" }}>Xem tất cả</Button>
                    </div>
                    {loadingTool ? (
                        <ListCardSkeleton count={12} />
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                {dataTool.map((x) =>
                                    filterTool(x) ? (
                                        <BookCard
                                            key={x._id.toString()}
                                            book={x}
                                            gridSizes={gridSizes}
                                            listCategories={listCategories}
                                            isBook={false}
                                            showRibbon
                                        />
                                    ) : null
                                )}
                            </Row>
                            {loadingMore && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", height: "200px" }}>
                                    <Lottie animationData={loadingAnimation} loop={true} style={{ width: "20%" }} />
                                </div>
                            )}
                            {!hasMore && dataTool.length > 0 && (
                                <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '16px', color: '#888' }}>
                                    Đã hiển thị tất cả dụng cụ phù hợp
                                </div>
                            )}
                            {!hasMore && dataTool.length === 0 && (
                                <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '16px', color: '#888' }}>
                                    Không tìm thấy dụng cụ nào phù hợp
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ToolPage;