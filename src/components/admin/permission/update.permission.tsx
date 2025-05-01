import TinyMCEEditor from "@/components/editor/input";
import {
  getAllRoleApi,
  updatePermissionApi,
  updateUserApi,
  uploadFile,
  getAllPermissionApi,
} from "@/services/api";
import {
  Button,
  Drawer,
  Form,
  GetProp,
  Input,
  notification,
  Select,
  Space,
  Upload,
  UploadProps,
} from "antd";
import { UploadFile } from "antd/lib";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import UploadButton from "@/components/helper/uploadButton";
import { ProFormUploadButton } from "@ant-design/pro-components";
import { useAppProvider } from "@/components/context/app.context";

interface IProps {
  isOpenUpdateModal: boolean;
  setIsOpenUpdateModal: (v: boolean) => void;
  reload: () => void;
  dataDetailModal: IGetPermission | null;
  setDatadetailModal: (v: IGetPermission | null) => void;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};
const PermissionUpdate = (props: IProps) => {
  const {
    isOpenUpdateModal,
    setIsOpenUpdateModal,
    reload,
    dataDetailModal,
    setDatadetailModal,
  } = props;
  const { isDarkTheme } = useAppProvider();
  const [moduleArray, setModuleArray] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  // Cập nhật giá trị form khi dataDetailModal thay đổi
  useEffect(() => {
    if (!dataDetailModal) return;
    form.setFieldsValue(dataDetailModal);
  }, [dataDetailModal]);

  const onFinish = async (values: ICreatePermission) => {
    const event: ICreatePermission = {
      apiPath: String(values.apiPath),
      method: String(values.method),

      module: Number(dataDetailModal?.module),
    };
    const res = await updatePermissionApi(event, dataDetailModal?._id || "");
    if (res.data) {
      api.success({
        message: "Cập nhật thành công",
      });
      setIsOpenUpdateModal(false);
      reload();
    } else {
      api.error({
        message: `${res.message}`,
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Drawer
        title="Cập nhật sự kiện"
        open={isOpenUpdateModal}
        onClose={() => setIsOpenUpdateModal(false)}
        width={"60%"}
        placement="left"
      >
        <Form
          {...layout}
          form={form}
          name="update-user-form"
          onFinish={onFinish}
        >
          <Form.Item
            label="path API"
            name="apiPath"
            rules={[{ required: true, message: "Vui lòng nhập api" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Method"
            name="method"
            rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
          >
            <Select placeholder="Chọn phương thức">
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Module"
            name="module"
            rules={[{ required: true, message: "Vui lòng chọn module" }]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default PermissionUpdate;
