// components/OrderUpdate.tsx
import { Modal, Form, Input, Select, notification } from 'antd';
import { useEffect } from 'react';
import { updateOrderApi } from '@/services/api';


interface OrderUpdateProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    reload: () => void;
    data: IGetOrder | null;
}

const OrderUpdate = ({ isOpen, setIsOpen, reload, data }: OrderUpdateProps) => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                status: data.status,
                shippingAddress: data.shippingAddress,
            });
        }
    }, [data, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const res = await updateOrderApi(values, data!._id);
            if (res.data) {
                api.success({ message: 'Cập nhật đơn hàng thành công' });
                setIsOpen(false);
                reload();
            } else {
                api.error({ message: res.message || 'Cập nhật đơn hàng thất bại' });
            }
        } catch (error: any) {
            api.error({ message: error.message || 'Lỗi khi cập nhật đơn hàng' });
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Cập nhật đơn hàng"
                open={isOpen}
                onOk={handleOk}
                onCancel={() => setIsOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Select.Option value="pending">Chờ xử lý</Select.Option>
                            <Select.Option value="processing">Đang xử lý</Select.Option>
                            <Select.Option value="completed">Hoàn thành</Select.Option>
                            <Select.Option value="cancelled">Đã hủy</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="shippingAddress" label="Địa chỉ giao hàng">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default OrderUpdate;