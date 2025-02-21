import { createUserApi, getAllRoleApi } from "@/services/api"
import { Button, Drawer, Form, Input, notification, Select, Space } from "antd"
import { useEffect, useState } from "react"


interface IProps {
    isOpenCreateModal: boolean
    setIsOpenCreateModal: (v: boolean) => void
    reload: () => void
}


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};


const UserCreate = (props: IProps) => {

    const { isOpenCreateModal,
        setIsOpenCreateModal,
        reload
    } = props


    const [arrRole, setArrRole] = useState<IGetRole[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchRole = async () => {
            setIsLoading(true)
            const res = await getAllRoleApi();
            if (res && res.data) {
                setArrRole(res.data.result)
            }
            setIsLoading(false)
        }
        fetchRole();
    }, [])



    const onFinish = async (values: ICreateUser) => {
        console.log(values);

        const res = await createUserApi(values);
        if (res.data) {
            api.success({
                message: "Thành công",
                description: "Tạo mới user thành công",
                placement: "topRight",
            });
            setIsOpenCreateModal(false);
            onReset()
            reload()
        } else {

            api.error({
                message: "Lỗi",
                description: `${res.message}`,
                placement: "topRight",
            });

        }
    };

    const onReset = () => {
        form.resetFields();
    };


    return (
        <>
            {contextHolder}
            <Drawer title="Create user"
                open={isOpenCreateModal}
                onClose={() => { setIsOpenCreateModal(false) }}
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
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: "Name không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email không được để trống" },
                            { type: "email", message: "Email không đúng định dạng" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Pass không được để trống" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: "Age không được để trống" }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: "Gender không được để trống" }]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Address không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: "Role không được để trống" }]}
                    >

                        <Select placeholder="Chọn vai trò" loading={isLoading}>
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
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>

                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default UserCreate