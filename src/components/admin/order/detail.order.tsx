import { Descriptions, Drawer, Image, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getBookApi } from '@/services/api';

interface IProps {
    isOpenDetailModal: boolean;
    setIsOpenDetailModal: (v: boolean) => void;
    dataDetailModal: IGetOrder | null;
    setDataDetailModal: (v: IGetOrder | null) => void;
}

const OrderDetail = (props: IProps) => {
    const { isOpenDetailModal, setIsOpenDetailModal, dataDetailModal, setDataDetailModal } =
        props;

    const [productDetails, setProductDetails] = useState<Record<string, IGetBook>>({});

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (dataDetailModal?.items) {
                const details: Record<string, IGetBook> = {};
                for (const item of dataDetailModal.items) {
                    try {
                        const res = await getBookApi(item.productId as string);
                        if (res.data) {
                            details[item.productId as string] = res.data;
                        }
                    } catch (error) {
                        console.error(`Error fetching book ${item.productId}:`, error);
                    }
                }
                setProductDetails(details);
            }
        };
        fetchProductDetails();
    }, [dataDetailModal]);

    const itemColumns = [
        {
            title: 'Hình ảnh',
            key: 'logo',
            render: (_: any, record: IOrderItem) =>
                productDetails[record.productId]?.logo ? (
                    <Image
                        width={50}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${productDetails[record.productId].logo
                            }`}
                        alt="Product Logo"
                        onError={() => 'Không có ảnh'}
                        placeholder={<div>Đang tải...</div>}
                    />
                ) : (
                    'Không có ảnh'
                ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Tổng',
            key: 'total',
            render: (_: any, record: IOrderItem) =>
                `${(record.price * record.quantity).toLocaleString()} VND`,
        },
    ];

    return (
        <>
            <Drawer
                title="Chi tiết đơn hàng"
                open={isOpenDetailModal}
                onClose={() => setIsOpenDetailModal(false)}
                width={'60%'}
            >
                <Descriptions title="Thông tin đơn hàng" bordered column={2}>
                    <Descriptions.Item label="ID">{dataDetailModal?._id}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {dataDetailModal?.status ? (
                            <Tag
                                color={
                                    dataDetailModal.status === 'completed'
                                        ? 'green'
                                        : dataDetailModal.status === 'cancelled'
                                            ? 'red'
                                            : dataDetailModal.status === 'processing'
                                                ? 'blue'
                                                : 'orange'
                                }
                            >
                                {dataDetailModal.status}
                            </Tag>
                        ) : (
                            'N/A'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                        {dataDetailModal?.totalAmount.toLocaleString()} VND
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ giao hàng">
                        {dataDetailModal?.shippingAddress || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {dataDetailModal?.createdAt
                            ? dayjs(dataDetailModal.createdAt).format('YYYY-MM-DD HH:mm:ss')
                            : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người tạo">
                        {dataDetailModal?.createdBy?.email || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">
                        {dataDetailModal?.updatedAt
                            ? dayjs(dataDetailModal.updatedAt).format('YYYY-MM-DD HH:mm:ss')
                            : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người cập nhật">
                        {dataDetailModal?.updatedBy?.email || 'N/A'}
                    </Descriptions.Item>
                </Descriptions>

                <h3 style={{ marginTop: '20px' }}>Danh sách sản phẩm</h3>
                <Table
                    columns={itemColumns}
                    dataSource={dataDetailModal?.items || []}
                    rowKey="productId"
                    pagination={false}
                    bordered
                />
            </Drawer>
        </>
    );
};

export default OrderDetail;