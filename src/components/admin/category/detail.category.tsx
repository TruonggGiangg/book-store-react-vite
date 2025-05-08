import { getRoleApi } from "@/services/api";
import { Descriptions, Drawer, Image, Tag } from "antd";
import { useEffect, useState } from "react";

interface IProps {
  isOpenDetailModal: boolean;
  setIsOpenDetailModal: (v: boolean) => void;
  dataDetailModal: IGetCategories | null;
  setDataDetailModal: (v: IGetCategories | null) => void;
}

const CategoryDetail = (props: IProps) => {
  const {
    isOpenDetailModal,
    setIsOpenDetailModal,
    dataDetailModal,
    setDataDetailModal,
  } = props;

  return (
    <>
      <Drawer
        title="Chi tiết danh mục"
        open={isOpenDetailModal}
        onClose={() => {
          setIsOpenDetailModal(false);
        }}
        width={"60%"}
      >
        <Descriptions title="Thông Tin Người Dùng" bordered column={2}>
          <Descriptions.Item label="ID">
            {dataDetailModal?._id}
          </Descriptions.Item>

          <Descriptions.Item label="Tên">
            {dataDetailModal?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục cho sản phẩm">
            {dataDetailModal?.isBook ? "Sách" : "Dụng cụ"}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            <div
              style={{ padding: "" }}
              dangerouslySetInnerHTML={{
                __html: dataDetailModal?.description as string,
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Logo">
            {dataDetailModal?.image ? (
              <Image
                width={200}
                src={`${import.meta.env.VITE_BACKEND_URL}/images/category/${
                  dataDetailModal.image
                }`}
                alt="Logo"
              />
            ) : (
              "Không có ảnh"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tạo lúc">
            {dataDetailModal?.createdAt
              ? new Date(dataDetailModal?.createdAt).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {dataDetailModal?.createdBy
              ? dataDetailModal?.createdBy.email
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lúc">
            {dataDetailModal?.updatedAt
              ? new Date(dataDetailModal?.updatedAt).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Người cập nhật">
            {dataDetailModal?.updatedBy
              ? dataDetailModal?.updatedBy.email
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default CategoryDetail;
