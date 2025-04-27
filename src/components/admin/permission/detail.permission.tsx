import { Descriptions, Drawer, Image, Tag } from "antd";

interface IProps {
  isOpenDetailModal: boolean;
  setIsOpenDetailModal: (v: boolean) => void;
  dataDetailModal: IGetPermission | null;
  setDataDetailModal: (v: IGetPermission | null) => void;
}
const PermissionDetail = (props: IProps) => {
  const {
    isOpenDetailModal,
    setIsOpenDetailModal,
    dataDetailModal,
    setDataDetailModal,
  } = props;

  return (
    <>
      <Drawer
        title="Permission detail"
        open={isOpenDetailModal}
        onClose={() => {
          setIsOpenDetailModal(false);
        }}
        width={"60%"}
      >
        <Descriptions title="Thông Tin Quyền" bordered column={2}>
          <Descriptions.Item label="path API">
            {dataDetailModal?.apiPath}
          </Descriptions.Item>

          <Descriptions.Item label="Method">
            {dataDetailModal?.method}
          </Descriptions.Item>
          <Descriptions.Item label="Module">
            {dataDetailModal?.module}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default PermissionDetail;
