import { Badge, Descriptions, Drawer, Image, Tag } from "antd";
import { getPermissionApiById } from "@/services/api";
import { useState, useEffect } from "react";
interface IProps {
  isOpenDetailModal: boolean;
  setIsOpenDetailModal: (v: boolean) => void;
  dataDetailModal: IGetRole | null;
  setDataDetailModal: (v: IGetRole | null) => void;
}
const RoleDetail = (props: IProps) => {
  const {
    isOpenDetailModal,
    setIsOpenDetailModal,
    dataDetailModal,
    setDataDetailModal,
  } = props;
  const [permissionDetails, setPermissionDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (dataDetailModal?.permissions) {
        try {
          const results = await Promise.all(
            dataDetailModal.permissions.map((id) => getPermissionApiById(id))
          );
          setPermissionDetails(results);
        } catch (error) {
          console.error("Failed to fetch permissions", error);
        }
      }
    };

    if (isOpenDetailModal) {
      fetchPermissions();
    } else {
      setPermissionDetails([]); // reset khi đóng
    }
  }, [dataDetailModal]);

  return (
    <>
      <Drawer
        title="Role detail"
        open={isOpenDetailModal}
        onClose={() => {
          setIsOpenDetailModal(false);
        }}
        width={"60%"}
      >
        <Descriptions title="Thông Tin Vai trò" bordered column={2}>
          <Descriptions.Item label="Name">
            {dataDetailModal?.name}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả">
            {dataDetailModal?.description}
          </Descriptions.Item>
          <Descriptions.Item label="Permission" span={2}>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {permissionDetails.map((permission) => (
                <Tag key={permission.data.id} color="blue">
                  {permission.data.name}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Create at">
            {dataDetailModal?.createdAt
              ? new Date(dataDetailModal.createdAt).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Update by">
            {dataDetailModal?.updatedAt
              ? new Date(dataDetailModal.updatedAt).toLocaleDateString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default RoleDetail;
