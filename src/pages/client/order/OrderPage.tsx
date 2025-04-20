import React from 'react';
import { Card, Steps, Descriptions, Button, Table, Tag, message } from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CarOutlined,
    SmileOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import Container from '@/components/layout/client/container.layout';

const { Step } = Steps;

interface OrderItem {
    key: string;
    name: string;
    quantity: number;
    price: number;
}

const orderItems: OrderItem[] = [
    {
        key: '1',
        name: 'Sách Toán lớp 12',
        quantity: 2,
        price: 50000,
    },
    {
        key: '2',
        name: 'Bút chì',
        quantity: 5,
        price: 3000,
    },
];

// Giả lập trạng thái đơn hàng
type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

const orderStatus: OrderStatus = 'pending'; // hoặc 'cancelled', v.v.

const statusMap: Record<OrderStatus, number | undefined> = {
    pending: 0,
    confirmed: 1,
    shipping: 2,
    completed: 3,
    cancelled: undefined, // cancelled không có trong Steps nên để undefined
};

const statusLabelMap: Record<OrderStatus, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    completed: 'Hoàn tất',
    cancelled: 'Đã huỷ',
};

const OrderPage: React.FC = () => {
    const currentStep = statusMap[orderStatus] ?? 0;

    const handleCancelOrder = () => {
        message.success('Đã huỷ đơn hàng!');
        // TODO: Gọi API huỷ đơn hàng ở đây
    };

    return (
        <div style={{ marginTop: '100px' }}>

            <Container>
                <Card title="Thông tin đơn hàng" style={{ marginBottom: 24 }}>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mã đơn">#ORD123456</Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt">2025-04-18</Descriptions.Item>
                        <Descriptions.Item label="Khách hàng">Nguyễn Văn A</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">
                            123 Đường Lê Lợi, Quận 1, TP.HCM
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={orderStatus + "" === 'cancelled' ? 'red' : 'blue'}>
                                {statusLabelMap[orderStatus]}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    {orderStatus === 'pending' && (
                        <Button
                            danger
                            style={{ marginTop: 16 }}
                            onClick={handleCancelOrder}
                        >
                            Huỷ đơn hàng
                        </Button>
                    )}
                </Card>

                <Card title="Tiến trình đơn hàng" style={{ marginBottom: 24 }}>
                    <Steps current={currentStep} status={orderStatus + "" === 'cancelled' ? 'error' : 'process'}>
                        <Step title="Chờ xác nhận" icon={<ClockCircleOutlined />} />
                        <Step title="Đã xác nhận" icon={<CheckCircleOutlined />} />
                        <Step title="Đang giao hàng" icon={<CarOutlined />} />
                        <Step title="Hoàn tất" icon={<SmileOutlined />} />
                    </Steps>
                </Card>

                <Card title="Chi tiết sản phẩm">
                    <Table
                        dataSource={orderItems}
                        pagination={false}
                        bordered
                        summary={(pageData) => {
                            const total = pageData.reduce((sum, item) => sum + item.quantity * item.price, 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={2}>
                                        <strong>Tổng cộng</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <strong>{total.toLocaleString()}đ</strong>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                        columns={[
                            {
                                title: 'Tên sản phẩm',
                                dataIndex: 'name',
                                key: 'name',
                            },
                            {
                                title: 'Số lượng',
                                dataIndex: 'quantity',
                                key: 'quantity',
                            },
                            {
                                title: 'Đơn giá',
                                dataIndex: 'price',
                                key: 'price',
                                render: (price) => `${price.toLocaleString()}đ`,
                            },
                        ]}
                    />
                </Card>
            </Container>
        </div>
    );
};

export default OrderPage;
