import { useAppProvider } from '@/components/context/app.context';
import { Modal, List, Avatar, Space, Rate, Typography, Divider, Pagination } from 'antd';
const { Text, Paragraph } = Typography;
import dayjs from 'dayjs';

import { useState } from 'react';



interface ReviewsModalProps {
    visible: boolean;
    onClose: () => void;
    reviews: Review[];
}

const ReviewsModal = ({ visible, onClose, reviews }: ReviewsModalProps) => {
    const pageSize = 10; // Số lượng đánh giá mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const { isDarkTheme } = useAppProvider();

    // Xác định style dựa trên chủ đề
    const themeStyles = {
        backgroundColor: isDarkTheme ? '#1f1f1f' : '#f9f9f9',
        contentBackground: isDarkTheme ? '#141414' : '#ffffff',
        textColor: isDarkTheme ? '#e0e0e0' : '#333',
        secondaryTextColor: isDarkTheme ? '#a0a0a0' : '#666',
        dividerColor: isDarkTheme ? '#333' : '#e8e8e8',
        hoverBackground: isDarkTheme ? '#2a2a2a' : '#f0f5ff',
        avatarBackground: isDarkTheme ? '#40c4ff' : '#1890ff',
        maskBackground: isDarkTheme ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
        starColor: isDarkTheme ? '#ffd700' : '#fadb14', // Màu sao cho Rate
    };

    // Tính toán dữ liệu cho trang hiện tại
    const paginatedReviews = reviews.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Xử lý thay đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Modal
            title={<Text strong style={{ fontSize: '20px', color: themeStyles.textColor }}>Tất cả đánh giá</Text>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            style={{ top: 20 }}
            bodyStyle={{
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: '16px 24px',
                backgroundColor: themeStyles.backgroundColor,
                display: 'flex',
                flexDirection: 'column',
            }}
            styles={{
                content: {
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    backgroundColor: themeStyles.contentBackground,
                },
                header: {
                    borderRadius: '12px 12px 0 0',
                    backgroundColor: themeStyles.contentBackground,
                    padding: '16px 24px',
                },
                mask: {
                    backgroundColor: themeStyles.maskBackground,
                },
            }}
        >
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <List
                    itemLayout="vertical"
                    dataSource={paginatedReviews}
                    renderItem={(review) => (
                        <List.Item
                            style={{
                                transition: 'background-color 0.3s ease',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                backgroundColor: themeStyles.contentBackground,
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{
                                            backgroundColor: themeStyles.avatarBackground,
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {review.userId.slice(0, 1).toUpperCase()}
                                    </Avatar>
                                }
                                title={
                                    <Space>
                                        <Text strong style={{ fontSize: '16px', color: themeStyles.textColor }}>
                                            {review.userName}
                                        </Text>
                                        <Rate
                                            allowHalf
                                            disabled
                                            value={review.rating}
                                            style={{ fontSize: '14px', color: themeStyles.starColor }}
                                        />
                                    </Space>
                                }
                                description={
                                    <>
                                        <Paragraph
                                            style={{
                                                fontSize: '14px',
                                                color: themeStyles.textColor,
                                                marginBottom: '8px',
                                                lineHeight: '1.6',
                                            }}
                                        >
                                            {review.comment}
                                        </Paragraph>
                                        <Text style={{ fontSize: '12px', color: themeStyles.secondaryTextColor }}>
                                            {dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}
                                        </Text>
                                    </>
                                }
                                style={{ alignItems: 'flex-start' }}
                            />
                            <Divider style={{ margin: '12px 0', borderColor: themeStyles.dividerColor }} />
                        </List.Item>
                    )}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'right', padding: '16px 0' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={reviews.length}
                    showSizeChanger={false}
                    showQuickJumper={true}
                    showTotal={(total) => (
                        <Text style={{ color: themeStyles.textColor }}>Tổng cộng {total} đánh giá</Text>
                    )}
                    onChange={handlePageChange}
                    style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        padding: '12px 0',
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: themeStyles.backgroundColor,
                        zIndex: 1,
                    }}
                    itemRender={(page, type, originalElement) => {
                        if (type === 'page') {
                            return (
                                <a
                                    style={{
                                        color: themeStyles.textColor,
                                        backgroundColor:
                                            page === currentPage ? themeStyles.avatarBackground : 'transparent',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                    }}
                                >
                                    {page}
                                </a>
                            );
                        }
                        return originalElement;
                    }}
                />
            </div>
        </Modal>
    );
};

export default ReviewsModal;