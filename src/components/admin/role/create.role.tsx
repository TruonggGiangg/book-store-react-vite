import { createRoleApi, getAllPermissionApi } from "@/services/api";
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  message,
  notification,
  Select,
  Space,
} from "antd";
const { Option } = Select;
import { useEffect, useState } from "react";
import { useAppProvider } from "@/components/context/app.context";
import TinyMCEEditor from "@/components/editor/input";
import UploadButton from "@/components/helper/uploadButton";

interface IProps {
  isOpenCreateModal: boolean;
  setIsOpenCreateModal: (v: boolean) => void;
  reload: () => void;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const RoleCreate = (props: IProps) => {
  const { isOpenCreateModal, setIsOpenCreateModal, reload } = props;
  const { isDarkTheme } = useAppProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [permissions, setPermissions] = useState<IGetPermission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (isOpenCreateModal) {
        setIsLoading(true);
        try {
          const response = await getAllPermissionApi("pageSize=1000");
          if (response.data) {
            setPermissions(response.data.result);
          }
        } catch (error) {
          console.error("Failed to fetch permissions", error);
          notification.error({
            message: "Error",
            description: "Failed to fetch permissions. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPermissions();
  }, [isOpenCreateModal]);
  const onFinish = async (values: ICreateRole) => {
    const role: ICreateRole = {
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    };
    setIsLoading(true);
    try {
      const response = await createRoleApi(role);
      message.success("Tạo vai trò thành công!");
      form.resetFields();
      setIsOpenCreateModal(false);
      reload();
    } catch (error: any) {
      console.error("Error creating role", error);
      notification.error({
        message: "Lỗi tạo vai trò",
        description:
          error?.response?.data?.message || "Đã xảy ra lỗi không xác định.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };
  return (
    <>
      {contextHolder}
      <Drawer
        title="Tạo vai trò"
        open={isOpenCreateModal}
        onClose={() => {
          setIsOpenCreateModal(false);
        }}
        width={"60%"}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          // style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Tên vai trò"
            name="name"
            rules={[{ required: true, message: "Name không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Mô tả không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="Phân quyền"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một quyền",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn quyền"
              style={{ width: "100%" }}
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {permissions.map((permission) => (
                <Option key={permission._id} value={permission._id}>
                  {permission.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Tạo
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Đặt lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default RoleCreate;
