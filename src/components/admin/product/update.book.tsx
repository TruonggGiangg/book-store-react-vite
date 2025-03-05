import { getAllCategoryApi, getCategoryApi, updateBookApi, uploadFile } from "@/services/api"
import { Button, Card, DatePicker, Drawer, Form, GetProp, Image, Input, InputNumber, notification, Select, Space, Upload, UploadFile, UploadProps } from "antd"
import { useEffect, useState } from "react"
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useAppProvider } from "@/components/context/app.context";
import { PlusOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    isOpenUpdateModal: boolean
    setIsOpenUpdateModal: (v: boolean) => void
    reload: () => void
    isBook: boolean
    dataDetail: IGetBook | null
    setDataDetail: (v: IGetBook | null) => void
}


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};


const UpdateProduct = (props: IProps) => {
    const { isOpenUpdateModal,
        setIsOpenUpdateModal,
        reload,
        isBook,
        dataDetail,
        setDataDetail
    } = props


    console.log("dataDetail", dataDetail)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const { isDarkTheme } = useAppProvider();
    const [arrCategory, setArrCategory] = useState<IGetCategories[] | []>([]);
    const [currentCategory, setCurrentCategory] = useState<IGetCategories[] | []>([]);

    const [thumbnail, setThumbnail] = useState<UploadFile[]>([]);
    const [slider, setSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataDetail) {
            // Cập nhận object cho thumbnail
            const arrThumbnail: UploadFile[] = [{
                uid: uuidv4(),
                name: dataDetail.logo + "",
                status: "done",
                url: dataDetail.logo + "" ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${dataDetail.logo}` : "",
            }];

            // Cập nhận mảng cho slider
            const arrSlider: UploadFile[] = dataDetail?.coverImage?.map((item) => ({
                uid: uuidv4(),
                name: item,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`,
            })) || [];


            // Cập nhật state
            setThumbnail(arrThumbnail);
            setSlider(arrSlider);
        }
    }, [dataDetail]);


    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);


            // Lấy danh sách danh mục
            const res = await getAllCategoryApi();
            if (res?.data) {
                setArrCategory(res.data.result);
            }

            // Kiểm tra nếu dataDetail không có classification
            if (!Array.isArray(dataDetail?.attributes?.classification)) {
                setIsLoading(false);
                return;
            }

            // Gọi API lấy chi tiết từng danh mục
            const responses = await Promise.all(
                dataDetail.attributes.classification.map(async (item) => {
                    if (!item) return null;

                    const res = await getCategoryApi(item);
                    return res?.data || null;

                })
            );

            // Cập nhật state
            setCurrentCategory(responses.filter((item): item is IGetCategories => item !== null));

            form.setFieldsValue({
                title: dataDetail?.title,
                author: dataDetail?.author,
                isBook: dataDetail?.isBook,
                price: dataDetail?.price,
                stock: dataDetail?.stock,
                sold: dataDetail?.sold,
                description: dataDetail?.description,
                coverImage: dataDetail?.coverImage,
                logo: dataDetail?.logo,
                attributes: {
                    publisher: dataDetail?.attributes?.publisher,
                    publishedDate: dataDetail?.attributes?.publishedDate
                        ? dayjs(dataDetail.attributes.publishedDate)
                        : null,  // Chuyển đổi thành `dayjs`
                    isbn: dataDetail?.attributes?.isbn,
                    language: dataDetail?.attributes?.language,
                    pages: dataDetail?.attributes?.pages,
                    classification: dataDetail?.attributes?.classification
                }
            });


            setIsLoading(false)
        };

        fetchCategories();
    }, [dataDetail]);



    useEffect(() => {

        const fetchCategories = async () => {
            setIsLoading(true);


            // Lấy danh sách danh mục
            const res = await getAllCategoryApi();
            if (res?.data) {
                setArrCategory(res.data.result);
            }

            // Kiểm tra nếu dataDetail không có classification
            if (!Array.isArray(dataDetail?.attributes?.classification)) {
                setIsLoading(false);
                return;
            }

            // Gọi API lấy chi tiết từng danh mục
            const responses = await Promise.all(
                dataDetail.attributes.classification.map(async (item) => {
                    if (!item) return null;

                    const res = await getCategoryApi(item);
                    return res?.data || null;

                })
            );

            // Cập nhật state và lọc bỏ `null`
            setCurrentCategory(responses.filter((item): item is IGetCategories => item !== null));


            setIsLoading(false);

        };

        fetchCategories();
    }, [dataDetail]);


    const onFinish = async (values: ICreateBook) => {
        console.log("data onFinish", values)
        console.log("slider", slider)
        console.log("thumbnail", thumbnail)
        console.log("values", values)
        const product: ICreateBook = {
            title: String(values.title),
            author: Array.isArray(values.author) ? values.author.map(String) : [],
            isBook: isBook, // Mặc định là sách
            price: Number(values.price),
            stock: Number(values.stock),
            sold: values.sold ? Number(values.sold) : undefined,
            description: String(values.description),
            coverImage: Array.isArray(slider)
                ? slider.map((img: any) => img.name)
                : [],
            logo: Array.isArray(thumbnail) && thumbnail.length > 0
                ? (thumbnail[0].name)
                : '',
            attributes: {
                publisher: values.attributes?.publisher ? String(values.attributes.publisher) : undefined,
                publishedDate: values.attributes?.publishedDate ? new Date(values.attributes.publishedDate) : undefined,
                isbn: values.attributes?.isbn ? String(values.attributes.isbn) : undefined,
                language: values.attributes?.language ? String(values.attributes.language) : undefined,
                pages: values.attributes?.pages ? Number(values.attributes.pages) : undefined,
                classification: values.attributes.classification
            },
        };

        if (isBook === false) delete product.attributes.publishedDate




        const res = await updateBookApi(product, dataDetail?._id);
        if (res.data) {
            setIsOpenUpdateModal(false);
            // onReset()
            reload()
            api.success({
                message: "Cập nhận sản phẩm thành",
                description: "Cập nhận sản phẩm thành công",
                placement: "topRight",
            })
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


    //logic upload


    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');

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

    const handleChangeCover: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const newList = newFileList.map((x) => {
            if (x.response) {
                return x.response
            } else {
                return x
            }
        })

        setSlider(newList)
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined
                style={{
                    marginTop: 8,
                    color: isDarkTheme ? "#f5f5f5" : "#333", // Màu chữ
                }}
            />
            <div style={{
                marginTop: 8,
                color: isDarkTheme ? "#f5f5f5" : "#333", // Màu chữ
            }}>Upload</div>
        </button>
    );

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
            const res = await uploadFile(file, "product");

            if (res?.data?.fileName) {
                const uploadedFile: UploadFile = {
                    uid: file.uid,
                    name: res.data.fileName,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/product/${res.data.fileName}`,
                };




                if (type === "logo") {

                    setThumbnail([uploadedFile]);
                } else {
                    setSlider((prev) => [...prev, uploadedFile]);
                }

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
            <Drawer title="Create user"
                open={isOpenUpdateModal}
                onClose={() => {
                    setIsOpenUpdateModal(false);
                    setDataDetail(null)
                    onReset();
                }}
                loading={isLoading}
                width={"60%"}

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
                        <Input.TextArea
                            placeholder="Nhập mô tả"

                        />
                    </Form.Item>


                    <Form.Item
                        // valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList || [])}
                        label="Logo"
                        name="logo"
                        rules={[{ required: true, message: "Logo không được để trống" }]}
                    >
                        <Upload

                            listType="picture-card"
                            maxCount={1}
                            multiple={false}
                            fileList={thumbnail || []}
                            onPreview={handlePreview}
                            onChange={handleChangeLogo}
                            beforeUpload={beforeUpload}
                            customRequest={(options) => {
                                handleUploadFile(options, "logo")
                            }}
                        >
                            {thumbnail.length <= 1 && uploadButton}
                        </Upload>
                    </Form.Item>


                    <Form.Item

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
                            fileList={slider}
                            onPreview={handlePreview}
                            onChange={handleChangeCover}
                            beforeUpload={beforeUpload}
                            customRequest={(options) => {
                                handleUploadFile(options, "coverImage")
                            }}
                        >
                            {slider.length < 10 && uploadButton}
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
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

            </Drawer >
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
            )
            }
        </>
    );
};


export default UpdateProduct