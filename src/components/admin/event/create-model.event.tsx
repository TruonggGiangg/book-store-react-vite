import {
  createEventApi,
  getAllEventApi,
  getAllRoleApi,
  uploadFile,
} from "@/services/api";

import {
  Button,
  Drawer,
  Form,
  Input,
  notification,
  Select,
  Space,
  GetProp,
  Image,
  InputNumber,
  message,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import TinyMCEEditor from "@/components/editor/input";
import { useAppProvider } from "@/components/context/app.context";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
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
const EventCreate = (props: IProps) => {
  const { isOpenCreateModal, setIsOpenCreateModal, reload } = props;
  const { isDarkTheme } = useAppProvider();
  const [arrEvent, setArrEvent] = useState<IGetEvent[]>([]);
  const [arrRole, setArrRole] = useState<IGetRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      const res = await getAllEventApi("");
      if (res && res.data) {
        setArrEvent(res.data.result);
      }
      setIsLoading(false);
    };
    fetchRole();
  }, []);

  const onFinish = async (values: ICreateEvent) => {
    const event: ICreateEvent = {
      name: values.name,
      description: values.description,
      image:
        Array.isArray(values.image) && values.image.length > 0
          ? values.image[0].response.name
          : "",
    };
    console.log(event);
    const res = await createEventApi(event);
    if (res.data) {
      api.success({
        message: "Thành công",
        description: "Tạo mới event thành công",
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
  };

  const onReset = () => {
    form.resetFields();
  };

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileListCover, setFileListCover] = useState<UploadFile[]>([]);
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

  const handleChangeCover: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileListCover(newFileList);
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
          url: `${import.meta.env.VITE_BACKEND_URL}/images/event/${res.data.fileName
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
        title="Create event"
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
            label="Tên sự kiện"
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
  );
};
export default EventCreate;
