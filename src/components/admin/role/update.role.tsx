import { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  Space,
  notification,
  Spin,
  Typography,
} from "antd";
import { getAllPermissionApi, updateRoleApi } from "@/services/api";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

// interface IPermission {
//   _id: string;
//   name: string;
//   apiPath: string;
//   method: string;
//   module: string;
// }

interface IProps {
  isOpenUpdateModal: boolean;
  setIsOpenUpdateModal: (v: boolean) => void;
  dataUpdateModal: IGetRole | null;
  setDataUpdateModal: (v: IGetRole | null) => void;
  fetchRoles: () => void; // Function to refresh roles list after update
}

const RoleUpdate = (props: IProps) => {
  const {
    isOpenUpdateModal,
    setIsOpenUpdateModal,
    dataUpdateModal,
    setDataUpdateModal,
    fetchRoles,
  } = props;

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
  };
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState<IGetPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  // Fetch all permissions when drawer opens
  useEffect(() => {
    const fetchPermissions = async () => {
      if (isOpenUpdateModal) {
        setLoading(true);
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
          setLoading(false);
        }
      }
    };
    fetchPermissions();
  }, [isOpenUpdateModal]);

  // Set form values when role data changes
  useEffect(() => {
    if (dataUpdateModal) {
      form.setFieldsValue({
        name: dataUpdateModal.name,
        description: dataUpdateModal.description || "",
        permissions: dataUpdateModal.permissions || [],
      });
    }
  }, [dataUpdateModal, form]);

  const handleClose = () => {
    setIsOpenUpdateModal(false);
    setDataUpdateModal(null);
    form.resetFields();
  };

  const handleSubmit = async (values: ICreateRole) => {
    console.log("data", values);
    if (!dataUpdateModal?._id) return;

    setSubmitting(true);
    const role: ICreateRole = {
      _id: dataUpdateModal._id,
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    };
    try {
      const response = await updateRoleApi(dataUpdateModal._id, role);

      if (response.data) {
        api.success({
          message: "Cập nhật vai trò thành",
          description: "Cập nhật vai trò thành công",
          placement: "topRight",
        });
        fetchRoles(); // Refresh roles list
        handleClose();
      }
    } catch (error: any) {
      console.error("Failed to update role", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          "Failed to update role. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title="Cập nhật loại sản phẩm"
        open={isOpenUpdateModal}
        onClose={() => {
          setIsOpenUpdateModal(false), setDataUpdateModal(null);
        }}
        width={"60%"}
        placement="left"
        loading={loading}
      >
        <Form
          {...layout}
          form={form}
          name="update-user-form"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Tên không được để trống" }]}
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
            label="Phân quyền"
            name="permissions"
            rules={[
              { required: true, message: "Phân quyền không được để trống" },
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
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Đặt lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default RoleUpdate;
