import TinyMCEEditor from "@/components/editor/input";
import { createCategoryApi, uploadFile } from "@/services/api";
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
  UploadFile,
  UploadProps,
} from "antd";
import { useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import UploadButton from "@/components/helper/uploadButton";
import { useAppProvider } from "@/components/context/app.context";

interface IProps {
  isOpenCreateModal: boolean;
  setIsOpenCreateModal: (v: boolean) => void;
  reload: () => void;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const CategoryCreate = (props: IProps) => {
  const { isOpenCreateModal, setIsOpenCreateModal, reload } = props;

  const { isDarkTheme } = useAppProvider();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: ICreateCategory) => {
    setIsLoading(true);

    const category: ICreateCategory = {
      name: String(values.name),

      isBook: values.isBook, // Mặc định là sách
      description: String(values.description),
      image:
        Array.isArray(values.image) && values.image.length > 0
          ? values.image[0].response.name
          : "",
    };

    const res = await createCategoryApi(category);
    if (res.data) {
      api.success({
        message: "Thành công",
        description: "Tạo mới category thành công",
        placement: "topRight",
      });
      setIsOpenCreateModal(false);
      onReset();
      reload();
    } else {
      api.error({
        message: "Lỗi",
        description: `${res.message}`,
        placement: "topRight",
      });
    }
    setIsLoading(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  //img
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState("");

  const [fileListLogo, setFileListLogo] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChangeLogo: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileListLogo(newFileList);
  };

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
        message: "Chỉ được tải lên ảnh có định dạng PNG hoặc JPG!",
      });
      return Upload.LIST_IGNORE;
    }

    if (!isLt5M) {
      api.error({
        message: "Ảnh phải nhỏ hơn 5MB!",
      });
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: string
  ) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;

    try {
      const res = await uploadFile(file, "category");

      if (res && res.data) {
        const uploadedFile: any = {
          uid: file.uid,
          name: res.data.fileName,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/category/${
            res.data.fileName
          }`,
        };

        setFileListLogo([{ ...uploadedFile }]);

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
      <Drawer
        title="Tạo danh mục"
        open={isOpenCreateModal}
        onClose={() => {
          setIsOpenCreateModal(false);
        }}
        width={"80%"}
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
            label="Danh mục cho sản phẩm"
            name="isBook"
            rules={[
              {
                required: true,
                message: "Category cho sản phẩm nào không được để trống",
              },
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
            <TinyMCEEditor isDarkMode={isDarkTheme} />
          </Form.Item>

          <Form.Item
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            label="Hình ảnh"
            name="image"
            rules={[
              { required: true, message: "Hình ảnh không được để trống" },
            ]}
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
                handleUploadFile(options, "logo");
              }}
            >
              {fileListLogo.length <= 1 && (
                <UploadButton isDarkTheme={isDarkTheme} />
              )}
            </Upload>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button loading={isLoading} type="primary" htmlType="submit">
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

export default CategoryCreate;
