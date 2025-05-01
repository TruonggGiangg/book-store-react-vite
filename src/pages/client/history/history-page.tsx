import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Typography, Card, Button, Image, Modal, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getAllOrderApi, getBookApi, updateOrderApi } from '@/services/api';
import Container from '@/components/layout/client/container.layout';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppProvider } from '@/components/context/app.context';
import AppBreadcrumb from '@/components/nav/AppBreadcrumb';

const { Title } = Typography;



const HistoryPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState<IGetOrder[]>([]);
    const [meta, setMeta] = useState<{ current: number; pageSize: number; pages: number; total: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [books, setBooks] = useState<IGetBook[]>([]);

    const { currUser } = useAppProvider();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Add sort parameter to sort by createdAt in descending order
                const response = await getAllOrderApi(
                    `current=${currentPage}&pageSize=${pageSize}&sort=-createdAt&createdBy._id=${currUser?._id}`
                );

                if (response.data) {
                    const orders = response.data.result;
                    setData(orders);
                    setMeta(response.data.meta);

                    // Get unique product IDs
                    const allProductIds = orders.flatMap((order: IGetOrder) =>
                        order.items.map((item: IOrderItem) => item.productId.toString())
                    );
                    const uniqueProductIds = Array.from(new Set(allProductIds));

                    if (uniqueProductIds.length > 0) {
                        // Fetch books
                        const bookPromises = uniqueProductIds.map(id => getBookApi(id));
                        const bookResponses = await Promise.allSettled(bookPromises);

                        const fetchedBooks = bookResponses
                            .filter((result): result is PromiseFulfilledResult<IBackendRes<IGetBook>> =>
                                result.status === 'fulfilled' &&

                                result.value.data !== undefined
                            )
                            .map(result => result.value.data!);

                        setBooks(fetchedBooks);
                    } else {
                        setBooks([]);
                    }
                } else {
                    setError(response.error?.toString() || 'Không thể tải dữ liệu đơn hàng.');
                }
            } catch (err) {
                setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage, pageSize]);

    const columns: ColumnsType<IGetOrder> = [
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            key: '_id',
            render: (id: string) => <span>{id}</span>,
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'items',
            key: 'items',
            render: (items: IOrderItem[]) => (
                <div className="list-none pl-0">
                    {items.map((item, index) => {
                        const book = books.find(b => b._id === item.productId.toString());
                        return (
                            <div
                                key={index}
                                style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px', borderRadius: '8px' }}
                            >
                                <Link to={`/book/${book?._id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                    {book?.coverImage?.[0] ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.coverImage[0]}`}
                                            alt={item.name}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginRight: '12px',
                                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src="/placeholder-image.jpg"
                                            alt={item.name}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginRight: '12px',
                                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                    )}
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                        <div>{item.name} (x{item.quantity})</div>
                                        <div style={{ fontSize: '12px', color: '#999' }}>
                                            {item.price.toLocaleString('vi-VN')}₫
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => <span>{amount.toLocaleString('vi-VN')}₫</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let colorClass = 'text-yellow-600';
                if (status === 'completed') colorClass = 'text-green-600';
                if (status === 'cancelled') colorClass = 'text-red-600';
                return <span className={`capitalize ${colorClass}`}>{translateStatus(status)}</span>;
            },
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'shippingAddress',
            key: 'shippingAddress',
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (user: UserReference) => <span>{user?.email || 'Không xác định'}</span>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',

            render: (createdAt: string) => <span>{dayjs(createdAt).format('DD/MM/YYYY HH:mm')}</span>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'numberPhone',
            key: 'numberPhone',
            render: (numberPhone: string) => <span>{numberPhone}</span>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: IGetOrder) => {
                if (record.status === 'pending') {
                    return (
                        <Button
                            danger
                            onClick={() => handleCancelOrder(record)}
                        >
                            Hủy
                        </Button>
                    );
                } else {
                    return (
                        <Button type="dashed" disabled>
                            Không thể hủy
                        </Button>
                    );
                }
            },
        },
    ];

    const handleCancelOrder = (data: ICreateOrder) => {
        if (data.status !== 'pending') {
            message.warning('Đơn hàng này không thể hủy vì đã được xác nhận.');
            return;
        }

        Modal.confirm({
            title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Hủy đơn',
            cancelText: 'Để sau',
            centered: true,
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await updateOrderApi({ ...data, status: 'cancelled' }, data._id);
                    message.success('Đơn hàng đã được hủy thành công.');
                    // Refresh orders
                    const response = await getAllOrderApi(
                        `current=${currentPage}&pageSize=${pageSize}&sort=-createdAt&createdBy._id=${currUser?._id}`
                    );
                    if (response.data) {
                        setData(response.data.result);
                        setMeta(response.data.meta);
                    }
                } catch (err) {
                    message.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
                }
            },
            onCancel: () => {
                console.log('Hủy hủy bỏ');
            },
        });
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Đang chờ xử lý';
            case 'processing':
                return 'Đang giao';
            case 'completed':
                return 'Đã hoàn tất';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    return (
        <div style={{ marginTop: "172px" }}>
            <Container>
                <AppBreadcrumb />
                <div>
                    <Title level={2}>Danh sách</Title>

                    {error && (
                        <Alert
                            message="Lỗi"
                            description={error}
                            type="error"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    {
                        isLoading ? (
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Spin size="large" tip="Đang tải dữ liệu..." />
                            </div>
                        ) : (

                            <Table<IGetOrder>
                                columns={columns}
                                dataSource={data}
                                rowKey="_id"
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: meta?.total,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    locale: { items_per_page: 'sản phẩm/trang' },
                                }}
                                onChange={handleTableChange}
                                scroll={{ x: 800 }}
                            />

                        )
                    }

                </div>
            </Container>
        </div>
    );
};

export default HistoryPage;