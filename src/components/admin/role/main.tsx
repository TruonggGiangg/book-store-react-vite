import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, notification } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { getRoleApi, getAllRoleApi, deleteRoleApi } from "@/services/api";

import { dateRangeValidate } from "@/services/helper";
import { useAppProvider } from "@/components/context/app.context";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import RoleDetail from "./detail.role";
import RoleUpdate from "./update.role";
import RoleCreate from "./create.role";
const RoleAdmin = () => {
  type TSearch = {
    current: number;
    name: string;
    description: string;
    method: string;
    pageSize: number;
  };
  const [api, contextHolder] = notification.useNotification();
  const [dataRole, setDataRole] = useState<IGetRole[]>([]);
  const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
  const [dataDetailModal, setDataDetailModal] = useState<IGetRole | null>(null);

  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const handleOpenCreateModal = () => {
    setIsOpenCreateModal(true);
  };

  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [dataUpdateModal, setDataUpdateModal] = useState<IGetRole | null>(null);
  const handleOpenUpdateModal = (record: IGetRole) => {
    setDataUpdateModal(record);
    setIsOpenUpdateModal(true);
  };
  const actionRef = useRef<ActionType>();
  const reload = () => {
    actionRef.current?.reload();
  };
  const columns: ProColumns<IGetRole>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      copyable: true,
      tooltip: "Tên vai trò",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
      copyable: true,
      tooltip: "Mô tả",
    },
    {
      title: "Action",
      hideInSearch: true,
      width: " 100px",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <EditOutlined
            onClick={() => handleOpenUpdateModal(record)}
            style={{ cursor: "pointer", color: "#ff5733" }}
          />
          <DeleteOutlined style={{ cursor: "pointer", color: "#ff5733" }} />
          <MoreOutlined
            onClick={() => handleOpenDetailModal(record)}
            style={{ cursor: "pointer", color: "#ff5733" }}
          />
        </div>
      ),
    },
  ];

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const { isDarkTheme } = useAppProvider();

  const handleOpenDetailModal = (record: IGetRole) => {
    setIsOpenDetailModal(true);
    setDataDetailModal(record);
  };
  const handleDelete = async (id: string) => {
    const res = await deleteRoleApi(id);
    if (res.data) {
      api.success({
        message: "Xóa thành công",
      });
      reload();
    } else {
      api.error({
        message: `${res.message}`,
      });
    }
  };
  return (
    <>
      {contextHolder}
      <h1>Quản lí vai trò</h1>
      <RoleDetail
        isOpenDetailModal={isOpenDetailModal}
        setIsOpenDetailModal={setIsOpenDetailModal}
        dataDetailModal={dataDetailModal}
        setDataDetailModal={setDataDetailModal}
      />
      <RoleUpdate
        isOpenUpdateModal={isOpenUpdateModal}
        setIsOpenUpdateModal={setIsOpenUpdateModal}
        dataUpdateModal={dataUpdateModal}
        setDataUpdateModal={setDataUpdateModal}
        fetchRoles={reload}
      />
      <RoleCreate
        isOpenCreateModal={isOpenCreateModal}
        setIsOpenCreateModal={setIsOpenCreateModal}
        reload={reload}
      />
      <ProTable<IGetRole, TSearch>
        direction="ltr"
        rowClassName={(record, index) => {
          if (index === 0) return isDarkTheme ? "first-row-dark" : "first-row"; // Hàng đầu tiên
          return index % 2 === 0
            ? isDarkTheme
              ? "even-row-dark"
              : "even-row" // Hàng chẵn
            : isDarkTheme
            ? "odd-row-dark"
            : "odd-row"; // Hàng lẻ
        }}
        scroll={{ x: 1000 }} // Giá trị x đặt lớn hơn tổng chiều rộng bảng
        bordered={true}
        columns={columns}
        dateFormatter="string"
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter);

          let query = `current=${params.current}&pageSize=${params.pageSize}`;

          if (params.name) {
            query += `&name=/${params.name}/i`;
          }
          if (params.description) {
            query += `&description=${params.description}`;
          }
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else {
            query += `&sort=-createdAt`;
          }

          const res = await getAllRoleApi();
          if (res.data) {
            //set state meta

            setMeta(res.data.meta);
            //set data for logic
            setDataRole(res.data.result);
          }

          return {
            //tra du lieu
            data: res.data?.result,
            page: params.current,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          // onChange: (page, pageSize) => { },
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          current: meta.current,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng {total} sự kiện
              </div>
            );
          },
        }}
        headerTitle="Permission Table"
        toolBarRender={() => [
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              handleOpenCreateModal();
            }}
            type="primary"
          >
            Thêm vai trò
          </Button>,
        ]}
      />
    </>
  );
};
export default RoleAdmin;
