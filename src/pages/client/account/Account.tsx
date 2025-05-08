"use client";

import type React from "react";
import { useState, useEffect } from "react";

import {
  Form,
  Input,
  Button,
  Card,
  Avatar,
  Typography,
  Divider,
  Select,
  notification,
  Spin,
  Row,
  Col,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  HomeOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { Option } = Select;

// Define the interface for the backend response
interface IBackendRes<T> {
  data: T;
  error?: string;
  message?: string;
}
import { useAppProvider } from "@/components/context/app.context";
import {
  getAccountApi,
  getAllUserApi,
  getUserApi,
  updateUserApi,
} from "@/services/api";
// Define the interface for the current user

// Define the interface for the update profile request
interface IUpdateProfileRequest {
  name?: string;
  age?: number;
  gender?: string;
  address?: string;
  email?: string;
}

const Account: React.FC = () => {
  const { currUser, setCurrUser, isLoading, setIsLoading } = useAppProvider();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [t] = useTranslation("global");
  const [account, setAccount] = useState<IGetUser>();

  useEffect(() => {
    const fetch = async () => {
      if (currUser?._id) {
        const user = await getUserApi(currUser._id);
        setAccount(user.data);
      }
    };

    fetch();
  }, [currUser?._id]);
  console.log(currUser);

  useEffect(() => {
    // Initialize form with current user data when available
    if (account) {
      form.setFieldsValue({
        name: account.name,
        age: account.age,
        gender: account.gender,
        address: account.address,
      });
    }
  }, [account, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    if (currUser) {
      form.setFieldsValue({
        name: account?.name,
        gender: account?.gender,
        address: account?.address,
        age: account?.age,
      });
    }
    setIsEditing(false);
  };
  console.log(account);

  const handleSubmit = async (values: any) => {
    if (!currUser) return;
    const updateAccount: ICreateUser = {
      password: account?.password || "",
      name: values.name,
      age: values.age,
      gender: values.gender,
      address: values.address,
      email: account?.email || "",
      role: account?.role || "",
      username: account?.username,
    };
    setIsSaving(true);
    try {
      // Call API to update profile
      const response = await updateUserApi(updateAccount, currUser._id);

      if (response.data && response.data) {
        // Update the context with new user data
        setCurrUser({
          ...currUser,
          ...response.data,
        });

        notification.success({
          message:
            t("Cập nhật tài khoản thành công") ||
            "Profile updated successfully",
          placement: "top",
        });

        setIsEditing(false);
      } else {
        notification.error({
          message:
            t("Cập nhật Tài khoản thất bại") || "Failed to update profile",
          description:
            response.data || t("Thử lại") || "Please try again later",
          placement: "top",
        });
      }
    } catch (error) {
      console.error("Lỗi cập nhật tài khoản:", error);
      notification.error({
        message: t("Lỗi cập nhật tài khoản") || "Failed to update profile",
        description:
          t("Cập nhật lỗi, hãy thử lại") ||
          "Server error. Please try again later",
        placement: "top",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!currUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <Title level={4}>
            {t("account.notLoggedIn") || "You are not logged in"}
          </Title>
          <Text>
            {t("account.pleaseLogin") || "Please login to view your profile"}
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto py-8 px-4"
      style={{ margin: "172px 0px 50px 0px" }}
    >
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={20} lg={18} xl={16}>
          <Card
            title={
              <div className="flex items-center">
                {/* <UserOutlined className="mr-2" /> */}
                <h1>Hồ sơ của tôi</h1>
                <div> Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
              </div>
            }
          // headStyle={{ backgroundColor: "#ff5733", color: "#fff" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar size={100} className="mb-4">
                  {account?.name ? (
                    account.name[0].toUpperCase()
                  ) : (
                    <UserOutlined />
                  )}
                </Avatar>
                <div>
                  <Title level={3}>{account?.name}</Title>
                  <Text type="secondary">{account?.email}</Text>
                </div>
              </div>
              <div>
                {!isEditing ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                  >
                    {t("Chỉnh sửa") || "Edit"}
                  </Button>
                ) : (
                  <Space>
                    <Button onClick={handleCancel}>
                      {t("Hủy") || "Cancel"}
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => form.submit()}
                      loading={isSaving}
                      icon={<SaveOutlined />}
                    >
                      {t("Lưu") || "Save"}
                    </Button>
                  </Space>
                )}
              </div>
            </div>
            <Divider />
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={!isEditing}
              initialValues={{
                name: account?.name,
                gender: account?.gender.toLocaleLowerCase(),
                age: account?.age,
                address: account?.address,
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label={t("Tên tài khoản") || "Name"}
                    rules={[
                      {
                        required: true,
                        message:
                          t("Tên tài khoản không được bỏ trống") ||
                          "Please enter your name",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder={t("account.name") || "Name"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gender"
                    label={t("Giới tính") || "Gender"}
                    rules={[
                      {
                        required: true,
                        message:
                          t("Giới tính không được bỏ trống") ||
                          "Please select your gender",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="male">{t("Male") || "Male"}</Option>
                      <Option value="female">{t("Female") || "Female"}</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="age"
                    label={t("Tuổi") || "Age"}
                    rules={[
                      {
                        required: true,
                        message:
                          t("Tuổi không được bỏ trống") ||
                          "Please enter your age",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      min={1}
                      placeholder={t("account.age") || "Age"}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="address"
                    label={t("Địa chỉ") || "Address"}
                    rules={[
                      {
                        required: true,
                        message:
                          t("Địa chỉ không được bỏ trống") ||
                          "Please enter your address",
                      },
                    ]}
                  >
                    <Input
                      prefix={<HomeOutlined />}
                      placeholder={
                        t("Địa chỉ không được bỏ trống") || "Address"
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Account;
