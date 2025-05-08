import { Card, Col, Row, Button, Space, Typography, Tag, Tabs } from "antd";
import { FC, lazy, memo, useEffect, useState } from "react";
import { FireOutlined, ImportOutlined, ToolOutlined } from "@ant-design/icons";
import Container from "@/components/layout/client/container.layout";
import { useAppProvider } from "@/components/context/app.context";

import { ProSkeleton } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";

const BookCard = lazy(() => import("./book-card"));
const ListCardSkeleton = lazy(() => import("./skeleton"));

type IProps = {
  loading: boolean;
  dataBook: Record<string, IGetBook[]>;
  dataCategory: IGetCategories[];
  dataBookHot: IGetBook[];
  dataBookNew: IGetBook[];
  dataToolsHot: IGetBook[];
  loadingHotBook: boolean;
  loadingNewBook: boolean;
  loadingHotTool: boolean;
};

const Product: FC<IProps> = memo(
  ({
    dataBook,
    loading,
    dataCategory,
    dataBookHot,
    dataBookNew,
    dataToolsHot,
    loadingHotBook,
    loadingHotTool,
    loadingNewBook,
  }) => {
    const { isDarkTheme } = useAppProvider();
    const navigate = useNavigate();
    return (
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Card
          size="default"
          style={{
            width: "100%",
            boxShadow: isDarkTheme
              ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
              : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0, color: "#FF5733" }}>
              <FireOutlined /> Sách Bán Chạy Nhất
            </h2>
            <Button
              type="link"
              style={{ color: "#FF5733" }}
              onClick={() => {
                navigate("/books");
              }}
            >
              Xem tất cả
            </Button>
          </div>
          {loadingHotBook ? (
            <ListCardSkeleton count={12} />
          ) : (
            <Row gutter={[16, 16]}>
              {dataBookHot.map((x) => {
                return (
                  <BookCard
                    key={x._id}
                    book={x}
                    gridSizes={{ xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 }}
                    listCategories={dataCategory}
                    isBook
                    showRibbon
                  />
                );
              })}
            </Row>
          )}
        </Card>

        <Card
          size="default"
          style={{
            width: "100%",
            boxShadow: isDarkTheme
              ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
              : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0, color: "#FF5733" }}>
              <ImportOutlined /> Sách Mới Nhất
            </h2>
            <Button
              type="link"
              style={{ color: "#FF5733" }}
              onClick={() => {
                navigate("/books");
              }}
            >
              Xem tất cả
            </Button>
          </div>
          {loadingNewBook ? (
            <ListCardSkeleton count={12} />
          ) : (
            <Row gutter={[16, 16]}>
              {dataBookNew.map((x) => {
                return (
                  <BookCard
                    key={x._id}
                    book={x}
                    gridSizes={{ xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 }}
                    listCategories={dataCategory}
                    isBook
                    showRibbon
                  />
                );
              })}
            </Row>
          )}
        </Card>

        <Card
          size="default"
          style={{
            width: "100%",
            boxShadow: isDarkTheme
              ? "0px 0px 12px rgba(255, 255, 255, 0.07)" // Hiệu ứng sáng hơn trong dark mode
              : "0px 0px 12px rgba(0, 0, 0, 0.1)", // Hiệu ứng mềm hơn trong light mode
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0, color: "#FF5733" }}>
              <ToolOutlined /> Dụng cụ bán chạy nhất
            </h2>
            <Button
              type="link"
              style={{ color: "#FF5733" }}
              onClick={() => {
                navigate("/tools");
              }}
            >
              Xem tất cả
            </Button>
          </div>
          {loadingHotTool ? (
            <ListCardSkeleton count={6} />
          ) : (
            <Row gutter={[16, 16]}>
              {dataToolsHot.map((x) => {
                return (
                  <BookCard
                    key={x._id}
                    book={x}
                    gridSizes={{ xxl: 4, xl: 6, lg: 6, md: 8, sm: 12, xs: 24 }}
                    listCategories={dataCategory}
                    isBook
                    showRibbon
                  />
                );
              })}
            </Row>
          )}
        </Card>
        <Card
          size="default"
          style={{
            minHeight: "320px", // Đảm bảo không bị nhảy layout
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
                  <Col md={24} lg={12} xl={8}>
                    <div
                      style={{
                        padding: "16px",
                        background: isDarkTheme ? "#1E1E1E" : "#FAFAFA",
                        color: isDarkTheme ? "#FFF" : "#333",
                        borderRadius: "8px",
                        overflow: "hidden",
                        minHeight: "150px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography.Title
                        level={4}
                        style={{ color: "#FF5733", marginBottom: "8px" }}
                      >
                        {category.name}
                      </Typography.Title>
                      <div
                        style={{
                          textAlign: "justify",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          wordBreak: "break-word",
                        }}
                        dangerouslySetInnerHTML={{
                          __html:
                            category.description ||
                            "Chưa có mô tả cho thể loại này.",
                        }}
                      />
                      <Button
                        onClick={() => {
                          navigate(`books/${category._id}`);
                        }}
                        type={"dashed"}
                        style={{ marginTop: "20px" }}
                      >
                        Xem thêm
                      </Button>
                    </div>
                  </Col>

                  <Col xs={24} lg={12} xl={16}>
                    <Row gutter={[16, 16]}>
                      {(dataBook[category._id] || []).slice(0, 10).map((x) => {
                        return (
                          <BookCard
                            key={x._id}
                            book={x}
                            gridSizes={{
                              xxl: 6,
                              xl: 8,
                              lg: 12,
                              md: 12,
                              sm: 12,
                              xs: 24,
                            }}
                            listCategories={dataCategory}
                            isBook
                            showRibbon
                          />
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              ),
            }))}
          />
        </Card>
      </Space>
    );
  }
);

export default Product;
