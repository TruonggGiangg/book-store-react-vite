import { Card, List, Button, InputNumber, Typography, Pagination, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';


const { Text, Title } = Typography;

interface CartBookListProps {
    books: IGetBook[];
    quantities: Record<string, number>;
    handleRemoveBook: (id: string) => void;
    handleQuantityChange: (bookId: string, value: number | null) => void;
    calculateTotal: () => number;
}

const CartBookList: React.FC<CartBookListProps> = ({
    books,
    quantities,
    handleRemoveBook,
    handleQuantityChange,
    calculateTotal,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Card title={<Title level={4}>Giỏ hàng</Title>} style={{ borderRadius: 12 }}>
            <List
                itemLayout="vertical"
                dataSource={paginatedBooks}
                renderItem={(book) => (
                    <Card
                        key={book._id}
                        hoverable
                        style={{
                            marginBottom: 16,
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease',
                        }}
                        bodyStyle={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            flexWrap: 'wrap',
                        }}
                    >


                        <Image
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
                            alt={book.title}
                            width={100}
                            height={100}
                            style={{ borderRadius: 8, objectFit: 'contain' }} // Adjust the style as needed
                            preview
                        //cover

                        />

                        <div style={{ flex: 1 }}>
                            <Title level={5} style={{ margin: 0 }}>
                                {book.title}
                            </Title>
                            <Text type="secondary">Tác giả: {book.author.join(', ')}</Text>
                            <br />
                            <Text strong style={{ fontSize: 16 }}>
                                {book.price.toLocaleString()} VNĐ
                            </Text>
                        </div>
                        <InputNumber
                            min={1}
                            value={quantities[book._id]}
                            onChange={(value) => handleQuantityChange(book._id, value)}
                            style={{ width: 80 }}
                        />
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveBook(book._id)}
                            danger
                        >
                            Xóa
                        </Button>
                    </Card>
                )}
            />
            <div style={{ textAlign: 'center', marginTop: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    current={currentPage}
                    total={books.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    style={{ textAlign: 'center', marginTop: 16 }}
                />
            </div>


            <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Title level={4} style={{ color: '#ff4d4f' }}>
                    Tổng tiền: {calculateTotal().toLocaleString()} VNĐ
                </Title>
            </div>
        </Card>
    );
};

export default CartBookList;
