import React, { useState, useEffect } from 'react';
import { Steps, Card, List, InputNumber, Button, Select, Form, Radio, message, Input, Table, Typography, Image } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, CreditCardOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { getAllBookApi } from '@/services/api';
import Container from '@/components/layout/client/container.layout';
import CartBookList from '@/components/client/order/cart-product-list';
const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;
import { ColumnsType } from 'antd/es/table';

const CheckoutPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [books, setBooks] = useState<IGetBook[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>('cod');
    const [form] = Form.useForm();



    const columns: ColumnsType<IGetBook> = [
        {
            title: 'Sản phẩm',
            dataIndex: 'title',
            key: 'title',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                    <Image
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${record.logo}`}
                        alt={record.title}
                        width={100}
                        height={100}
                        style={{ borderRadius: 8, objectFit: 'contain' }} // Adjust the style as needed
                        preview
                    //cover

                    />
                    <div>
                        <Text strong>{record.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            ✍️ {record.author.join(', ')}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price: number) => `${price.toLocaleString()} VNĐ`,
        },
        {
            title: 'Số lượng',
            dataIndex: '_id',
            key: 'quantity',
            align: 'center',
            render: (id: string) => quantities[id] || 1,
        },
        {
            title: 'Thành tiền',
            dataIndex: '_id',
            key: 'total',
            align: 'right',
            render: (id: string, record: IGetBook) =>
                `${(record.price * (quantities[id] || 1)).toLocaleString()} VNĐ`,
        },
    ];

    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await getAllBookApi('current=1&pageSize=12');
                if (res.data) {
                    setBooks(res.data.result || []);
                    const initialQuantities = res.data.result.reduce(
                        (acc: { [key: string]: number }, book: IGetBook) => ({
                            ...acc,
                            [book._id]: 1,
                        }),
                        {} as { [key: string]: number }
                    );
                    setQuantities(initialQuantities);
                }
            } catch (error) {
                message.error('Lỗi khi tải danh sách sách');
            }
        };

        fetchBooks();
    }, []);

    // Fetch provinces from Vietnam API
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p/');
                setProvinces(response.data);
            } catch (error) {
                message.error('Lỗi khi tải danh sách tỉnh/thành');
            }
        };
        fetchProvinces();
    }, []);

    const fetchDistricts = async (provinceCode: string) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            setDistricts(response.data.districts);
            setWards([]);
        } catch (error) {
            message.error('Lỗi khi tải danh sách quận/huyện');
        }
    };

    const fetchWards = async (districtCode: string) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            setWards(response.data.wards);
        } catch (error) {
            message.error('Lỗi khi tải danh sách phường/xã');
        }
    };

    // Handle quantity change
    const handleQuantityChange = (bookId: string, value: number | null) => {
        if (value !== null) {
            setQuantities((prev) => ({ ...prev, [bookId]: value }));
        }
    };

    // Handle remove book
    const handleRemoveBook = (bookId: string) => {
        setBooks((prev) => prev.filter((book) => book._id !== bookId));
        setQuantities((prev) => {
            const newQuantities = { ...prev };
            delete newQuantities[bookId];
            return newQuantities;
        });
        message.success('Đã xóa sách khỏi giỏ hàng');
    };

    // Calculate total
    const calculateTotal = () => {
        return books.reduce((total, book) => {
            return total + book.price * (quantities[book._id] || 1);
        }, 0);
    };


    // Handle form submission
    const onFinish = async () => {
        try {
            await form.validateFields();
            if (currentStep === 0) {
                if (books.length === 0) {
                    message.error('Giỏ hàng trống, vui lòng thêm sách');
                    return;
                }
                setCurrentStep(1);
            } else if (currentStep === 1) {
                setCurrentStep(2);
            } else if (currentStep === 2) {
                // const values = form.getFieldsValue();
                // if (paymentMethod === 'vnpay') {
                //     handleVNPayPayment(values);
                // } else if (paymentMethod === 'momo') {
                //     handleMomoPayment(values);
                // } else
                if (paymentMethod === 'cod') {
                    message.success('Đặt hàng COD thành công!');
                }
            }
        } catch (error) {
            message.error('Vui lòng điền đầy đủ tất cả các thông tin bắt buộc');
        }
    };

    const steps = [
        {
            title: 'Giỏ hàng',
            icon: <ShoppingCartOutlined />,
            content: (
                <>
                    <CartBookList
                        books={books}
                        quantities={quantities}
                        handleRemoveBook={handleRemoveBook}
                        handleQuantityChange={handleQuantityChange}
                        calculateTotal={calculateTotal}
                    />
                </>
            ),
        },
        {
            title: 'Thông tin giao hàng',
            icon: <HomeOutlined />,
            content: (
                <Card title="Địa chỉ giao hàng">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        >
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="province"
                            label="Tỉnh/Thành"
                            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành' }]}
                        >
                            <Select onChange={(value) => fetchDistricts(value)} placeholder="Chọn tỉnh/thành">
                                {provinces.map((province) => (
                                    <Option key={province.code} value={province.code}>
                                        {province.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="district"
                            label="Quận/Huyện"
                            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                        >
                            <Select onChange={(value) => fetchWards(value)} placeholder="Chọn quận/huyện">
                                {districts.map((district) => (
                                    <Option key={district.code} value={district.code}>
                                        {district.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="ward"
                            label="Phường/Xã"
                            rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                        >
                            <Select placeholder="Chọn phường/xã">
                                {wards.map((ward) => (
                                    <Option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Địa chỉ chi tiết"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
                        >
                            <Input.TextArea placeholder="Nhập địa chỉ chi tiết" />
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            title: 'Thanh toán',
            icon: <CreditCardOutlined />,
            content: (
                <Card title="Hình thức thanh toán">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            name="paymentMethod"
                            label="Chọn phương thức thanh toán"
                            rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                        >
                            <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                                <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                    <Card title={<Title level={4}>🧾 Hóa đơn thanh toán</Title>} style={{ marginTop: 24, borderRadius: 12 }}>
                        <Table
                            dataSource={books}
                            columns={columns}
                            pagination={false}
                            rowKey="_id"
                            bordered
                        />
                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <Title level={4} style={{ color: '#ff4d4f' }}>
                                Tổng tiền: {calculateTotal().toLocaleString()} VNĐ
                            </Title>
                        </div>
                    </Card>
                </Card>
            ),
        },
    ];

    return (
        <div style={{ marginTop: '100px' }}>
            <Container>
                <Steps current={currentStep} onChange={setCurrentStep}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} icon={item.icon} />
                    ))}
                </Steps>
                <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
                <div style={{ marginTop: 24, textAlign: 'right' }}>
                    {currentStep > 0 && (
                        <Button style={{ marginRight: 8 }} onClick={() => setCurrentStep(currentStep - 1)}>
                            Quay lại
                        </Button>
                    )}
                    <Button type="primary" onClick={onFinish}>
                        {currentStep === steps.length - 1 ? 'Thanh toán' : 'Tiếp tục'}
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default CheckoutPage;


// Handle VNPay payment
// const handleVNPayPayment = async (values: any) => {
//     try {
//         const tmnCode = import.meta.env.VITE_VNPAY_TMN_CODE;
//         const secretKey = import.meta.env.VITE_VNPAY_HASH_SECRET;
//         const vnpUrl = import.meta.env.VITE_VNPAY_URL;
//         const returnUrl = import.meta.env.VITE_VNPAY_RETURN_URL;

//         if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
//             throw new Error('Thiếu biến môi trường VNPay');
//         }

//         const date = new Date();
//         const createDate = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
//         const orderId = `ORDER${Date.now()}`;
//         const amount = calculateTotal();

//         const vnpParams: { [key: string]: string } = {
//             vnp_Version: '2.1.0',
//             vnp_Command: 'pay',
//             vnp_TmnCode: tmnCode,
//             vnp_Amount: (amount * 100).toString(),
//             vnp_CreateDate: createDate,
//             vnp_CurrCode: 'VND',
//             vnp_IpAddr: '127.0.0.1',
//             vnp_Locale: 'vn',
//             vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
//             vnp_OrderType: 'book',
//             vnp_ReturnUrl: returnUrl,
//             vnp_TxnRef: orderId,
//         };

//         const sortedKeys = Object.keys(vnpParams).sort();
//         const signDataArray: string[] = [];
//         sortedKeys.forEach((key) => {
//             const value = vnpParams[key];
//             signDataArray.push(`${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`);
//         });

//         const signData = signDataArray.join('&');
//         const secureHash = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);

//         vnpParams.vnp_SecureHash = secureHash;

//         const queryString = new URLSearchParams(vnpParams).toString();
//         const paymentUrl = `${vnpUrl}?${queryString}`;
//         window.location.href = paymentUrl;
//     } catch (error) {
//         console.error('Lỗi thanh toán VNPay:', error);
//         message.error('Lỗi khi tạo thanh toán VNPay');
//     }
// };

// // Handle Momo payment (mock)
// const handleMomoPayment = async (values: any) => {
//     message.success('Thanh toán Momo thành công (mô phỏng)!');
// };
