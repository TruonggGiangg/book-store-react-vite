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
        email: account.email,
        password: account.password,
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
        email: account?.email,
        gender: account?.gender,
        address: account?.address,
        age: account?.age,
        password: account?.password,
      });
    }
    setIsEditing(false);
  };
  console.log(account);

  const handleSubmit = async (values: ICreateUser) => {
    if (!currUser) return;

    setIsSaving(true);
    try {
      // Call API to update profile
      const response = await updateUserApi(values, currUser._id);

      if (response.data && response.data) {
        // Update the context with new user data
        setCurrUser({
          ...currUser,
          ...response.data,
        });

        notification.success({
          message: t("account.updateSuccess") || "Profile updated successfully",
          placement: "top",
        });

        setIsEditing(false);
      } else {
        notification.error({
          message: t("account.updateError") || "Failed to update profile",
          description:
            response.data || t("account.tryAgain") || "Please try again later",
          placement: "top",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notification.error({
        message: t("account.updateError") || "Failed to update profile",
        description:
          t("account.serverError") || "Server error. Please try again later",
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
      style={{ margin: "120px 0px 50px 0px" }}
    >
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={20} lg={18} xl={16}>
          <Card
            title={
              <div className="flex items-center">
                <UserOutlined className="mr-2" />
                <p>Hồ sơ của tôi</p>
                <div> Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
              </div>
            }
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
                  <Text type="secondary">{account?.role}</Text>
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
                email: account?.email,
                password: account?.password,
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
                    name="email"
                    label={t("Email") || "Email"}
                    rules={[
                      {
                        required: true,
                        message:
                          t("Email không được bỏ trống") ||
                          "Please enter your email",
                      },
                      {
                        type: "email",
                        message:
                          t("account.emailInvalid") ||
                          "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder={t("account.email") || "Email"}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="password"
                    label={t("Mật khẩu") || "Password"}
                    rules={[
                      {
                        required: true,
                        message:
                          t("Mật khẩu không được bỏ trống") ||
                          "Please enter your password",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<UserOutlined />}
                      placeholder={t("account.password") || "Password"}
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
