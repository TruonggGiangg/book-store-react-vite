import { getRoleApi } from "@/services/api";
import { Descriptions, Drawer, Tag } from "antd";
import { useEffect, useState } from "react";

interface IProps {
  isOpenDetailModal: boolean;
  setIsOpenDetailModal: (v: boolean) => void;
  dataDetailModal: IGetUser | null;
  setDataDetailModal: (v: IGetUser | null) => void;
}

const UserDetail = (props: IProps) => {
  const {
    isOpenDetailModal,
    setIsOpenDetailModal,
    dataDetailModal,
    setDataDetailModal,
  } = props;

  const [role, setRole] = useState<string>("");
  useEffect(() => {
    const fetchRole = async () => {
      const res = await getRoleApi(dataDetailModal?.role || "");
      if (res.data) {
        setRole(res.data.name);
      }
    };
    fetchRole();
  });

  return (
    <>
      <Drawer
        title="Chi tiết người dùng"
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
          <Descriptions.Item label="Email">
            {dataDetailModal?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Tuổi">
            {dataDetailModal?.age}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {dataDetailModal?.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {dataDetailModal?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag>{role}</Tag>
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

export default UserDetail;
