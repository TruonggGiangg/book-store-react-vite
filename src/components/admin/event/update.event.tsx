import { getAllEventApi, updateEventApi, uploadFile } from "@/services/api";
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
import { useEffect, useState } from "react";
import { useAppProvider } from "@/components/context/app.context";
import TinyMCEEditor from "@/components/editor/input";
import { UploadFile } from "antd/lib";
import { v4 as uuidv4 } from "uuid";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import UploadButton from "@/components/helper/uploadButton";

interface IProps {
  isOpenUpdateModal: boolean;
  setIsOpenUpdateModal: (v: boolean) => void;
  reload: () => void;
  dataDetailModal: IGetEvent | null;
  setDataDetailModal: (v: IGetEvent | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const EventUpdate = (props: IProps) => {
  const {
    isOpenUpdateModal,
    setIsOpenUpdateModal,
    reload,
    dataDetailModal,
    setDataDetailModal,
  } = props;
  const { isDarkTheme } = useAppProvider();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [thumbnail, setThumbnail] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState("");
  useEffect(() => {
    if (!dataDetailModal) return;

    // Cập nhật thumbnail trước khi render
    const newThumbnail: UploadFile[] = dataDetailModal.image
      ? [
          {
            uid: uuidv4(),
            name: dataDetailModal.image,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/event/${
              dataDetailModal.image
            }`,
          },
        ]
      : [];

    setThumbnail(newThumbnail);

    // Cập nhật form ngay sau khi cập nhật thumbnail
    form.setFieldsValue({
      name: dataDetailModal.name,
      description: dataDetailModal.description,
      image: newThumbnail, // Gán thumbnail mới vào Form
    });
  }, [dataDetailModal]);
  const onFinish = async (values: ICreateEvent) => {
    const event: ICreateEvent = {
      name: String(values.name),
      description: String(values.description),
      image:
        Array.isArray(values.image) && values.image.length > 0
          ? values.image[0].name
          : "",
    };

    console.log(event);
    const res = await updateEventApi(event, dataDetailModal?._id || "");
    if (res.data) {
      api.success({
        message: "Thành công",
        description: "Cập nhật event thành công",
        placement: "topRight",
      });
      setIsOpenUpdateModal(false);
      setDataDetailModal(null);

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
      const res = await uploadFile(file, "event");

      if (res && res.data) {
        const uploadedFile: any = {
          uid: file.uid,
          name: res.data.fileName,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/event/${
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
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
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
            rules={[
              { required: true, message: "Hình ảnh không được để trống" },
            ]}
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
                handleUploadFile(options, "logo");
              }}
            >
              {thumbnail.length <= 1 && (
                <UploadButton isDarkTheme={isDarkTheme} />
              )}
            </Upload>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
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
export default EventUpdate;
