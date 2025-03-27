import TinyMCEEditor from "@/components/editor/input";
import { getAllRoleApi, updateCategoryApi, updateUserApi, uploadFile } from "@/services/api"
import { Button, Drawer, Form, GetProp, Input, notification, Select, Space, Upload, UploadProps } from "antd"
import { UploadFile } from "antd/lib"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import UploadButton from "@/components/helper/uploadButton";
import { ProFormUploadButton } from "@ant-design/pro-components";
import { useAppProvider } from "@/components/context/app.context";
import { t } from "i18next";

interface IProps {
    isOpenUpdateModal: boolean
    setIsOpenUpdateModal: (v: boolean) => void
    reload: () => void
    dataDetailModal: IGetCategories | null
    setDatadetailModal: (v: IGetCategories | null) => void
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};


const UserUpdate = (props: IProps) => {
    const { isOpenUpdateModal, setIsOpenUpdateModal, reload, dataDetailModal, setDatadetailModal } = props;
    const { isDarkTheme } = useAppProvider();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const [thumbnail, setThumbnail] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');

    // Cập nhật giá trị form khi dataDetailModal thay đổi
    useEffect(() => {
        if (!dataDetailModal) return;

        // Cập nhật thumbnail trước khi render
        const newThumbnail: UploadFile[] = dataDetailModal.image
            ? [{
                uid: uuidv4(),
                name: dataDetailModal.image,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/category/${dataDetailModal.image}`,
            }]
            : [];

        setThumbnail(newThumbnail);

        // Cập nhật form ngay sau khi cập nhật thumbnail
        form.setFieldsValue({
            name: dataDetailModal.name,
            isBook: dataDetailModal.isBook,
            description: dataDetailModal.description,
            image: newThumbnail, // Gán thumbnail mới vào Form
        });
    }, [dataDetailModal]);


    const onFinish = async (values: ICreateCategory) => {


        const category: ICreateCategory = {
            name: String(values.name),

            isBook: values.isBook, // Mặc định là sách
            description: String(values.description),
            image: thumbnail[0].name,

        };

        console.log(category);
        const res = await updateCategoryApi(category, dataDetailModal?._id || "");
        if (res.data) {
            api.success({
                message: "Thành công",
                description: "Cập nhật category thành công",
                placement: "topRight",
            });
            setIsOpenUpdateModal(false);
            setDatadetailModal(null);

            form.resetFields();
            reload();
        } else {
            api.error({
                message: "Lỗi",
                description: `${res.message}`,
                placement: "topRight",
            });
            setThumbnail([]);
        }
    };

    // Upload img
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChangeLogo: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const newList = newFileList.map((x) => {
            if (x.response) {
                return x.response
            } else {
                return x
            }
        })
        setThumbnail(newList)
    }




    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: File) => {
        const isPngOrJpg = ["image/png", "image/jpeg"].includes(file.type);
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isPngOrJpg) {
            api.error({
                message: "Chỉ được tải lên ảnh có định dạng PNG hoặc JPG!"
            }
            );
            return Upload.LIST_IGNORE;
        }

        if (!isLt5M) {

            api.error({
                message: "Ảnh phải nhỏ hơn 5MB!"
            }
            );
            return Upload.LIST_IGNORE;
        }

        return true;
    };


    const handleUploadFile = async (options: RcCustomRequestOptions, type: string) => {
        const { onSuccess, onError } = options;
        const file = options.file as UploadFile;

        try {
            const res = await uploadFile(file, "category");

            if (res?.data?.fileName) {
                const uploadedFile: UploadFile = {
                    uid: file.uid,
                    name: res.data.fileName,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/category/${res.data.fileName}`,
                };

                setThumbnail([uploadedFile]);


                onSuccess?.(uploadedFile);
            } else {
                throw new Error("Tải ảnh thất bại");
            }
        } catch (error) {

            api.error({ message: "Tải ảnh lên thất bại!" });
            onError?.(new Error("Upload thất bại"));
        }
    };

    return (
        <>
            {contextHolder}
            <Drawer title="Cập nhật người dùng"
                open={isOpenUpdateModal}
                onClose={() => { setIsOpenUpdateModal(false), setDatadetailModal(null) }}
                width={"60%"}
                placement="left"
                loading={isLoading}
            >
                <Form {...layout} form={form} name="update-user-form" onFinish={onFinish}>

                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: "Name không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Category cho sản phẩm"
                        name="isBook"
                        rules={[
                            { required: true, message: "Category cho sản phẩm nào không được để trống" },

                        ]}
                    >
                        <Select>
                            <Select.Option value={true}>Sách</Select.Option>
                            <Select.Option value={false}>Dụng cụ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"

                        rules={[{ required: true, message: "Mô tả không được để trống" }]}
                    >
                        <TinyMCEEditor />
                    </Form.Item>

                    <Form.Item
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        label="Hình ảnh"
                        name="image"
                        rules={[{ required: true, message: "Hình ảnh không được để trống" }]}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            multiple={false}
                            fileList={thumbnail}
                            onPreview={handlePreview}
                            onChange={handleChangeLogo}
                            beforeUpload={beforeUpload}
                            customRequest={(options) => {
                                handleUploadFile(options, "logo")
                            }}
                        >
                            {thumbnail.length <= 1
                                && <UploadButton isDarkTheme={isDarkTheme} />}
                        </Upload>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Cập nhật
                            </Button>
                            <Button htmlType="button" onClick={() => form.resetFields()}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer >
        </>
    );
};


export default UserUpdate