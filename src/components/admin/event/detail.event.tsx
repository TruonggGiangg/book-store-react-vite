import { getRoleApi } from "@/services/api";
import { Descriptions, Drawer, Tag, Image } from "antd";
import { useEffect, useState } from "react";

interface IProps {
  isOpenDetailModal: boolean;
  setIsOpenDetailModal: (v: boolean) => void;
  dataDetailModal: IGetEvent | null;
  setDataDetailModal: (v: IGetEvent | null) => void;
}

const EventDetail = (props: IProps) => {
  const {
    isOpenDetailModal,
    setIsOpenDetailModal,
    dataDetailModal,
    setDataDetailModal,
  } = props;

  // const [role, setRole] = useState<string>("");
  // useEffect(() => {
  //     const fetchRole = async () => {
  //         const res = await getRoleApi(dataDetailModal?.role || "");
  //         if (res.data) {
  //             setRole(res.data.name)
  //         }
  //     }
  //     fetchRole()
  // })
  useEffect(() => {
    console.log("dataDetailModal", dataDetailModal);
  });
  return (
    <>
      <Drawer
        title="Chi tiết sự kiện"
        open={isOpenDetailModal}
        onClose={() => {
          setIsOpenDetailModal(false);
        }}
        width={"60%"}
      >
        <Descriptions title="Thông Tin Sự kiện" bordered column={2}>
          <Descriptions.Item label="ID">
            {dataDetailModal?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên">
            {dataDetailModal?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            <div
              dangerouslySetInnerHTML={{
                __html: dataDetailModal?.description || "",
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Logo" span={2}>
            {dataDetailModal?.image ? (
              <Image
                width={200}
                src={`${import.meta.env.VITE_BACKEND_URL}/images/event/${
                  dataDetailModal.image
                }`}
                alt="coverImage"
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
export default EventDetail;
