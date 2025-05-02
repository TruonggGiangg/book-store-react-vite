import { createBookApi, getAllCategoryApi, getCategoryApi, uploadFile } from "@/services/api"
import { Button, Card, DatePicker, Drawer, Form, GetProp, Image, Input, InputNumber, message, notification, Select, Space, Upload, UploadFile, UploadProps } from "antd"
import { useEffect, useState } from "react"

import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useAppProvider } from "@/components/context/app.context";
import TinyMCEEditor from "@/components/editor/input";
import UploadButton from "@/components/helper/uploadButton";

interface IProps {
    isOpenCreateModal: boolean
    setIsOpenCreateModal: (v: boolean) => void
    reload: () => void
    isBook: boolean
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type UploadFolderType = "coverImage" | "logo";


const AddBook = (props: IProps) => {

    const { isOpenCreateModal,
        setIsOpenCreateModal,
        reload,
        isBook
    } = props

    const { isDarkTheme } = useAppProvider();

    const [arrCategory, setArrCategory] = useState<IGetCategories[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const [api, contextHolder] = notification.useNotification();


    useEffect(() => {
        const fetchRole = async () => {
            setIsLoading(true)
            const res = await getAllCategoryApi('current=1&pageSize=100');
            if (res && res.data) {
                setArrCategory(res.data.result)
            }
            setIsLoading(false)
        }
        fetchRole();
    }, [])


    console.log(arrCategory);






    const onFinish = async (values: ICreateBook) => {
        setIsLoading(true)

        if (isBook === true) {

        }
        const product: ICreateBook = {
            title: String(values.title),
            author: Array.isArray(values.author) ? values.author.map(String) : [],
            isBook: isBook, // Mặc định là sách
            price: Number(values.price),
            stock: Number(values.stock),
            sold: values.sold ? Number(values.sold) : undefined,
            description: String(values.description),
            coverImage: Array.isArray(values.coverImage)
                ? values.coverImage.map((img: any) => img.response.name)
                : [],
            logo: Array.isArray(values.logo) && values.logo.length > 0
                ? values.logo[0].response.name
                : '',
            attributes: {
                publisher: values.attributes?.publisher ? String(values.attributes.publisher) : undefined,
                publishedDate: values.attributes?.publishedDate ? new Date(values.attributes.publishedDate) : undefined,
                isbn: values.attributes?.isbn ? String(values.attributes.isbn) : undefined,
                language: values.attributes?.language ? String(values.attributes.language) : undefined,
                pages: values.attributes?.pages ? Number(values.attributes.pages) : undefined,
                classification: values.attributes?.classification
            },
        };

        if (isBook === false) delete product.attributes.publishedDate

        const res = await createBookApi(product);
        if (res.data) {
            setIsOpenCreateModal(false);
            // onReset()
            reload()
            api.success({
                message: "Tạo sản phẩm thành",
                description: "Tạo sản phẩm thành công",
                placement: "topRight",
            })
            onReset()
        } else {
            api.error({
                message: "Lỗi",
                description: `${res.message}`,
                placement: "topRight",
            });
            onReset()
        }
        setIsLoading(false)

    };

    const onReset = () => {
        form.resetFields();
    };

    /**
     * logic upload file img
     */
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');



    //file list cover  image
    const [fileListCover, setFileListCover] = useState<UploadFile[]>([]);
    const [fileListLogo, setFileListLogo] = useState<UploadFile[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChangeLogo: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileListLogo(newFileList);
    }

    const handleChangeCover: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileListCover(newFileList);
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
        const { onSuccess } = options;
        const file = options.file as UploadFile;

        try {
            const res = await uploadFile(file, "product");

            if (res && res.data) {
                const uploadedFile: any = {
                    uid: file.uid,
                    name: res.data.fileName,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/product/${res.data.fileName}`,
                };

                if (type === "logo") {
                    setFileListLogo([{ ...uploadedFile }]);
                } else {
                    setFileListCover((prevState) => [...prevState, { ...uploadedFile }]);
                }

                // Gọi onSuccess để báo thành công
                onSuccess && onSuccess(uploadedFile);
            }
        } catch (error) {
            api.error({ message: "Tải ảnh lên thất bại!" });
        }
    };


    return (
        <>
            {contextHolder}
            <Drawer title="Create product"
                open={isOpenCreateModal}
                onClose={() => {
                    setIsOpenCreateModal(false);
                    onReset();
                }}
                width={"80%"}
            >

                <Form
                    {...layout}
                    form={form}
                    name="book-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Tựa đề"
                        name="title"
                        rules={[{ required: true, message: "Tựa đề không được để trống" }]}
                    >
                        <Input placeholder="Nhập tựa đề" />
                    </Form.Item>

                    <Form.Item
                        label="Tác giả - Nhà sản xuất"
                        name="author"
                        rules={[{ required: true, message: "Tác giả không được để trống" }]}
                    >
                        <Select mode="tags" placeholder="Nhập tên tác giả" filterOption={false} />
                    </Form.Item>

                    <Form.Item
                        label="Giá bán"
                        name="price"
                        rules={[{ required: true, message: "Giá không được để trống" }]}
                    >
                        <InputNumber
                            placeholder="Nhập giá tiền"
                            addonAfter="VNĐ"
                            style={{ width: "100%" }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng tồn"
                        name="stock"
                        rules={[{ required: true, message: "Số lượng tồn không được để trống" }]}
                    >
                        <Input placeholder="Nhập số lượng tồn" type="number" />
                    </Form.Item>


                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Mô tả không được để trống" }]}
                    >
                        <TinyMCEEditor isDarkMode={isDarkTheme} />
                    </Form.Item>


                    <Form.Item
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        label="Logo"
                        name="logo"
                        rules={[{ required: true, message: "Logo không được để trống" }]}
                    >
                        <Upload
                            action=""
                            listType="picture-card"
                            maxCount={1}
                            multiple={false}
                            fileList={fileListLogo}
                            onPreview={handlePreview}
                            onChange={handleChangeLogo}
                            beforeUpload={beforeUpload}
                            customRequest={(options) => {
                                handleUploadFile(options, "logo")
                            }}
                        >
                            {fileListLogo.length <= 1 && <UploadButton isDarkTheme={isDarkTheme} />}
                        </Upload>
                    </Form.Item>

                    {/* Upload Ảnh Bìa */}
                    <Form.Item
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        label="Ảnh bìa"
                        name="coverImage"
                        rules={[{ required: true, message: "Ảnh bìa không được để trống" }]}
                    >
                        <Upload
                            action=""
                            listType="picture-card"
                            maxCount={10}
                            multiple={true}
                            fileList={fileListCover}
                            onPreview={handlePreview}
                            onChange={handleChangeCover}
                            beforeUpload={beforeUpload}
                            customRequest={(options) => {
                                handleUploadFile(options, "coverImage")
                            }}
                        >
                            {fileListCover.length < 10 && <UploadButton isDarkTheme={isDarkTheme} />}
                        </Upload>
                    </Form.Item>


                    {
                        isBook === true
                            ?
                            <>
                                <Form.Item label="Thuộc tính sản phẩm"
                                >
                                    <Card>
                                        <Form.Item
                                            labelCol={{ span: 4 }}
                                            label="Nhà xuất bản"
                                            rules={[{ required: true, message: "Nhà xuất bản không được để trống" }]}
                                            name={["attributes", "publisher"]}
                                        >
                                            <Input
                                                placeholder="Nhập nhà xuất bản"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            labelCol={{ span: 4 }}
                                            label="Ngày xuất bản"
                                            rules={[{ required: true, message: "Ngày xuất bản không được để trống" }]}
                                            name={["attributes", "publishedDate"]}
                                        >
                                            <DatePicker
                                                placeholder="Chọn ngày xuất bản"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            labelCol={{ span: 4 }}
                                            label="ISBN"
                                            rules={[{ required: true, message: "Nhà xuất bản không được để trống" }]}
                                            name={["attributes", "isbn"]}

                                        >
                                            <Input
                                                placeholder="Nhập ISBN"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            labelCol={{ span: 4 }}
                                            label="Ngôn ngữ"
                                            rules={[{ required: true, message: "Nhà xuất bản không được để trống" }]}
                                            name={["attributes", "language"]}
                                        >
                                            <Input
                                                placeholder="Nhập ngôn ngữ"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            labelCol={{ span: 4 }}
                                            label="Số trang"
                                            rules={[{ required: true, message: "Nhà xuất bản không được để trống" }]}
                                            name={["attributes", "pages"]}
                                        >
                                            <Input
                                                placeholder="Nhập số trang"
                                                type="number" />
                                        </Form.Item>

                                        <Form.Item
                                            labelCol={{ span: 4 }}
                                            label="Thể loại"
                                            name={["attributes", "classification"]}
                                            rules={[{ required: true, message: "Thể loại không được để trống" }]}
                                        >
                                            <Select mode="multiple" placeholder="Chọn thể loại" loading={isLoading}>
                                                {arrCategory.map((category) => {
                                                    if (!!category.isBook) {
                                                        return (
                                                            <Select.Option key={category.name} value={category._id}>
                                                                {category.name}
                                                            </Select.Option>
                                                        )
                                                    }

                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Card>


                                </Form.Item>
                            </>
                            :
                            <>
                                <Form.Item
                                    labelCol={{ span: 4 }}
                                    label="Phân loại"
                                    name={["attributes", "classification"]}
                                    rules={[{ required: true, message: "Phân loại không được để trống" }]}
                                >
                                    <Select mode="multiple" placeholder="Chọn phân loại" loading={isLoading}>
                                        {arrCategory.map((category) => {
                                            if (!category.isBook) {
                                                return (
                                                    <Select.Option key={category.name} value={category._id}>
                                                        {category.name}
                                                    </Select.Option>
                                                )
                                            }

                                        })}




                                    </Select>
                                </Form.Item>
                            </>

                    }


                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

            </Drawer>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    )
}

export default AddBook