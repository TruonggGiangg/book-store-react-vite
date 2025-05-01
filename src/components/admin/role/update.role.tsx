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
    <Drawer
      title="Update Role"
      open={isOpenUpdateModal}
      onClose={handleClose}
      width={"60%"}
      footer={
        <Space>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={submitting}
          >
            Update
          </Button>
        </Space>
      }
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "50px 0",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: dataUpdateModal?.name || "",
            description: dataUpdateModal?.description || "",
            permissions: dataUpdateModal?.permissions || [],
          }}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter role description" },
            ]}
          >
            <Input placeholder="Enter role description" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[
              {
                required: true,
                message: "Please select at least one permission",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
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
        </Form>
      )}
    </Drawer>
  );
};

export default RoleUpdate;
