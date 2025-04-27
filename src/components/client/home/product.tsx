import { Card, Col, Rate, Row, Button, Space, Typography, Tooltip, Tag, InputNumber, Skeleton, Badge, Tabs } from "antd";
import { FC, useState } from "react";
import { ShoppingCartOutlined, TagOutlined, HeartOutlined, UserOutlined, CalendarOutlined, FireOutlined, ImportOutlined, ToolOutlined } from "@ant-design/icons";
import Container from "@/components/layout/client/container.layout";
import { useAppProvider } from "@/components/context/app.context";
import ListCardSkeleton from "./skeleton";
import { ListSkeletonItem, ProSkeleton } from "@ant-design/pro-components";
import BookCard from "./book-card";


type IProps = {
    loading: boolean;
    dataBook: Record<string, IGetBook[]>;
    dataCategory: IGetCategories[];
    dataBookHot: IGetBook[];
    dataBookNew: IGetBook[];
    dataToolsHot: IGetBook[];
    loadingExtra: boolean;
};

const Product: FC<IProps> = ({ dataBook, loading, dataCategory, dataBookHot, dataBookNew, dataToolsHot, loadingExtra }) => {
 
    

    const renderTag = (id: string, list:IGetCategories[]) => {
        const category = list.find((x) => x._id === id);
        return category ? <Tag color="volcano" key={category._id}>{category.name}</Tag> : null;
    };
    const { isDarkTheme } = useAppProvider()

 

    
    return (
        <Container>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card size="default" style={{
                         minHeight:"300px",
                    width: "100%",
                    boxShadow: isDarkTheme
                        ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
                        : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ margin: 0, color: "#FF5733" }}>
                            <FireOutlined /> Sách Bán Chạy Nhất
                        </h2>
                        <Button type="link" style={{ color: "#FF5733" }}>Xem tất cả</Button>
                    </div>
                    {loading ? <ListCardSkeleton count={6} /> : <Row gutter={[16, 16]}>{dataBookHot.map((x) => {
                        return <BookCard 
                        key={x._id} 
                        book={x} 
                        gridSizes={{ xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 }} 
                        listCategories={dataCategory} 
                        isBook 
                        showRibbon 
                    />
                    })}</Row>}
                </Card>

                <Card size="default" style={{
                    minHeight:"300px",
                    width: "100%",
                    boxShadow: isDarkTheme
                        ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
                        : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ margin: 0, color: "#FF5733" }}>
                            <ImportOutlined /> Sách Mới Nhất
                        </h2>
                        <Button type="link" style={{ color: "#FF5733" }}>Xem tất cả</Button>
                    </div>
                    {loading ? <ListCardSkeleton count={6} /> : <Row gutter={[16, 16]}>{dataBookNew.map((x) =>   {
                        return <BookCard 
                        key={x._id} 
                        book={x} 
                        gridSizes={{ xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 }} 
                        listCategories={dataCategory} 
                        isBook 
                        showRibbon 
                    />
                    })}</Row>}
                </Card>

                <Card size="default" style={{
                         minHeight:"300px",
                    width: "100%",
                    boxShadow: isDarkTheme
                        ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
                        : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ margin: 0, color: "#FF5733" }}>
                            <ToolOutlined /> Dụng cụ bán chạy nhất
                        </h2>
                        <Button type="link" style={{ color: "#FF5733" }}>Xem tất cả</Button>
                    </div>
                    {loading ? <ListCardSkeleton count={6} /> : <Row gutter={[16, 16]}>{dataToolsHot.map((x) =>  {
                        return <BookCard 
                        key={x._id} 
                        book={x} 
                        gridSizes={{ xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 }} 
                        listCategories={dataCategory} 
                        isBook 
                        showRibbon 
                    />
                    })}</Row>}
                </Card>
                <Card
                    size="default"
                    style={{
                        width: "100%",
                        boxShadow: isDarkTheme
                            ? "0px 0px 12px rgba(255, 255, 255, 0.07)"
                            : "0px 0px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography.Title level={3} style={{ color: "#FF5733" }}>
                        Bảng xếp hạng bán chạy mọi thời đại
                    </Typography.Title>

                    <Tabs
                        defaultActiveKey="0"
                        tabPosition="top"
                        size="middle"
                        style={{ marginTop: "16px" }}
                        items={dataCategory.map((category, index) => ({
                            key: String(index),
                            label: category.name,
                            children: loading ? (
                                <ProSkeleton type="list" list={3} active />
                            ) : (
                                <Row gutter={[24, 24]} style={{ padding: "16px" }}>
                                    {/* Bên trái - Mô tả thể loại (35%) */}
                                    <Col md={24} lg={12} xl={8} >
                                        <div
                                            style={{
                                                padding: "16px",
                                                background: isDarkTheme ? "#1E1E1E" : "#FAFAFA",
                                                color: isDarkTheme ? "#FFF" : "#333",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                minHeight: "150px",
                                            }}
                                        >
                                            <Typography.Title level={4} style={{ color: "#FF5733", marginBottom: "8px" }}>
                                                {category.name}
                                            </Typography.Title>
                                            <div
                                                style={{
                                                    textAlign: "justify",
                                                    fontSize: "14px",
                                                    lineHeight: "1.6",
                                                    wordBreak: "break-word",
                                                }}
                                                dangerouslySetInnerHTML={{ __html: category.description || "Chưa có mô tả cho thể loại này." }}
                                            />
                                        </div>
                                    </Col>


                                    <Col xs={24} lg={12} xl={16}>
                                        <Row gutter={[16, 16]}>
                                                {(dataBook[category._id] || []).slice(0, 10).map((x) =>  {
                                            return <BookCard 
                                                key={x._id} 
                                                book={x} 
                                                gridSizes={{ xxl: 6, xl: 8, lg: 12, md: 12, sm: 12, xs: 24 }} 
                                                listCategories={dataCategory} 
                                                isBook 
                                                showRibbon 
                                            />
                                        })}
                                        </Row>
                                    </Col>
                                </Row>
                            ),
                        }))}
                    />
                </Card>
            </Space>


        </Container>
    );
};

export default Product;
        // const renderBookCard = (book: IGetBook, xl: number, lg: number, md: number, sm: number, xs: number) => (
        //     <Col
        //         key={book._id}
        //         xs={xs}
        //         sm={sm}
        //         md={md}
        //         lg={lg}
        //         xl={xl}
        //         onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        //         onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        //         style={{
        //             transition: "transform 0.3s ease-in-out",
    
        //         }}
    
        //     >
    
        //         <Badge.Ribbon text="HOT" color="red">
        //             <Card
    
        //                 style={{
        //                     borderRadius: "8px",
        //                     padding: "10px",
        //                     overflow: "hidden",
        //                     transition: "transform 0.3s ease-in-out",
        //                     boxShadow: isDarkTheme
        //                         ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
        //                         : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
        //                 }}
    
        //                 cover={
        //                     <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", borderRadius: "12px" }}>
        //                         <img
        //                             alt={book.title}
        //                             src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`}
        //                             style={{
        //                                 width: "100%",
        //                                 height: "100%",
        //                                 objectFit: "contain",
        //                                 transition: "transform 0.3s ease-in-out",
        //                             }}
    
        //                         />
        //                     </div>
        //                 }
        //             >
        //                 <Card.Meta
        //                     title={
        //                         <Tooltip title={book.title}>
        //                             <Typography.Title level={5} style={{ margin: 0 }}>
        //                                 {book.title}
        //                             </Typography.Title>
        //                         </Tooltip>
        //                     }
        //                     description={
        //                         <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        //                             <div>
        //                                 {book.attributes?.classification?.map((category) => renderTag(category))}
        //                             </div>
    
        //                             <Tooltip title={book.author.join(", ")}>
        //                                 <Space>
        //                                     <UserOutlined style={{ color: "#FF5733" }} />
        //                                     <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
        //                                         {book.author.join(", ")}
        //                                     </Typography.Paragraph>
        //                                 </Space>
        //                             </Tooltip>
    
        //                             <Space>
        //                                 <ShoppingCartOutlined style={{ color: "#FF5733" }} />
        //                                 <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
        //                                     Đã bán: {book.sold ?? 0}
        //                                 </Typography.Paragraph>
        //                                 <CalendarOutlined style={{ color: "#FF5733" }} />
        //                                 <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
        //                                     {new Date(book.createdAt || "").toLocaleDateString()}
        //                                 </Typography.Paragraph>
        //                             </Space>
    
        //                             <Space>
        //                                 <TagOutlined style={{ color: "#FF5733" }} />
        //                                 <Typography.Paragraph strong style={{ color: "#FF5733", fontSize: "16px", margin: 0 }} ellipsis={{ rows: 1 }}>
        //                                     {book.price.toLocaleString()} VNĐ
        //                                 </Typography.Paragraph>
        //                             </Space>
    
        //                             <Space>
        //                                 <HeartOutlined style={{ color: "#FF5733" }} />
        //                                 <Rate disabled value={book.rating || 0} allowHalf />
        //                             </Space>
    
        //                             <Space align="center">
        //                                 <InputNumber min={1} defaultValue={1} size="small" style={{ padding: "6px" }} />
        //                                 <Button type="primary" icon={<ShoppingCartOutlined />} style={{ background: "#FF5733", borderColor: "#FF5733" }}>
        //                                     Add to cart
        //                                 </Button>
        //                             </Space>
        //                         </div>
        //                     }
        //                 />
        //             </Card>
        //         </Badge.Ribbon>
        //     </Col>
        // );