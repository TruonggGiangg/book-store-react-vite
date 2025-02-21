import { getAllRoleApi, updateUserApi } from "@/services/api"
import { Button, Drawer, Form, Input, notification, Select, Space } from "antd"
import { useEffect, useState } from "react"


interface IProps {
    isOpenUpdateModal: boolean
    setIsOpenUpdateModal: (v: boolean) => void
    reload: () => void
    dataDetailModal: IGetUser | null
}


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};


const UserUpdate = (props: IProps) => {
    const { isOpenUpdateModal, setIsOpenUpdateModal, reload, dataDetailModal } = props;

    const [arrRole, setArrRole] = useState<IGetRole[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchRole = async () => {
            setIsLoading(true);
            const res = await getAllRoleApi();
            if (res && res.data) {
                setArrRole(res.data.result);
            }
            setIsLoading(false);
        };
        fetchRole();
    }, []);

    // Cập nhật giá trị form khi dataDetailModal thay đổi
    useEffect(() => {
        if (dataDetailModal) {
            // Tìm role tương ứng từ arrRole
            const selectedRole = arrRole.find(role => role._id === dataDetailModal.role);

            form.setFieldsValue({
                name: dataDetailModal.name,
                email: dataDetailModal.email,
                age: dataDetailModal.age,
                gender: dataDetailModal.gender,
                address: dataDetailModal.address,
                role: selectedRole ? selectedRole._id : undefined, // Gán ID role nếu tìm thấy
                password: dataDetailModal.password,
            });
        }
    }, [dataDetailModal, arrRole, form]);


    const onFinish = async (values: ICreateUser) => {
        console.log(values);
        const res = await updateUserApi(values, dataDetailModal?._id || "");
        if (res.data) {
            api.success({
                message: "Thành công",
                description: "Cập nhật user thành công",
                placement: "topRight",
            });
            setIsOpenUpdateModal(false);
            form.resetFields();
            reload();
        } else {
            api.error({
                message: "Lỗi",
                description: `${res.message}`,
                placement: "topRight",
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Drawer title="Cập nhật người dùng"
                open={isOpenUpdateModal}
                onClose={() => setIsOpenUpdateModal(false)}
                width={"60%"}
                placement="left"
            >
                <Form {...layout} form={form} name="update-user-form" onFinish={onFinish}>
                    <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" }
                    ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Tuổi" name="age" rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
                        <Select placeholder="Chọn vai trò" loading={isLoading} >
                            {arrRole.map((role) => (
                                <Select.Option key={role._id} value={role._id}>
                                    {role.name}
                                </Select.Option>
                            ))}
                        </Select>
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


export default UserUpdate