import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, notification } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import {
  getAllPermissionApi,
  deletePermissionApi,
  updatePermissionApi,
} from "@/services/api";
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
import PermissionDetail from "./detail.permission";
import PermissionUpdate from "./update.permission";
const PermissionAdmin = () => {
  type TSearch = {
    current: number;
    apiPath: string;
    method: string;
    pageSize: number;
    module: string;
  };
  const [api, contextHolder] = notification.useNotification();
  const actionRef = useRef<ActionType>();
  const reload = () => {
    actionRef.current?.reload();
  };
  const columns: ProColumns<IGetPermission>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    // {
    //   title: "ID",
    //   dataIndex: "_id",
    //   hideInSearch: true,
    //   copyable: true,
    //   ellipsis: true,
    //   tooltip: "ID quyền",
    //   render: (_, record) => {
    //     return (
    //       <a
    //         onClick={() => {
    //           //   handleOpenDetailModal(record);
    //         }}
    //       >{`${record._id}`}</a>
    //     );
    //   },
    // },
    {
      title: "Path API",
      dataIndex: "apiPath",
      ellipsis: true,
      copyable: true,
      tooltip: "Đường dẫn API",
    },
    {
      title: "Method",
      dataIndex: "method",
      ellipsis: true,
      copyable: true,
      tooltip: "Phương thức API",
    },
    {
      title: "Module",
      dataIndex: "module",
      ellipsis: true,
      copyable: true,
      tooltip: "Module",
      render: (_, record) => {
        return <span>{record.module}</span>;
      },
      sorter: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      width: " 100px",
      render: (_, record) => {
        return (
          <>
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >

              <MoreOutlined
                style={{ cursor: "pointer", color: "#ff5733" }}
                onClick={() => handleOpenDetailModal(record)}
              />
            </div>
          </>
        );
      },
    },
  ];

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const { isDarkTheme } = useAppProvider();
  const [dataPermission, setPermissionData] = useState<IGetPermission[]>([]);
  const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
  const [dataDetailModal, setDataDetailModal] = useState<IGetPermission | null>(
    null
  );
  const handleOpenDetailModal = (record: IGetPermission) => {
    setIsOpenDetailModal(true);
    setDataDetailModal(record);
  };
  const handleDelete = async (id: string) => {
    const res = await deletePermissionApi(id);
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

  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const handleOpenUpdateModal = () => {
    setIsOpenUpdateModal(true);
  };
  return (
    <>
      {contextHolder}
      <h1>Quản lý phân quyền </h1>
      <PermissionDetail
        isOpenDetailModal={isOpenDetailModal}
        setIsOpenDetailModal={setIsOpenDetailModal}
        dataDetailModal={dataDetailModal}
        setDataDetailModal={setDataDetailModal}
      />
      <PermissionUpdate
        isOpenUpdateModal={isOpenUpdateModal}
        setIsOpenUpdateModal={setIsOpenUpdateModal}
        dataDetailModal={dataDetailModal}
        setDatadetailModal={setDataDetailModal}
        reload={reload}
      />
      <ProTable<IGetPermission, TSearch>
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

          if (params.apiPath) {
            query += `&name=/${params.apiPath}/i`;
          }
          if (params.method) {
            query += `&method=/${params.method}/i`;
          }
          if (params.module) {
            query += `&module=${params.module}`;
          }
          if (sort && sort.createdAt) {
            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
              }`;
          } else {
            query += `&sort=-createdAt`;
          }

          const res = await getAllPermissionApi(query);
          if (res.data) {
            //set state meta

            setMeta(res.data.meta);
            //set data for logic
            setPermissionData(res.data.result);
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
          //   <Button
          //     icon={<PlusOutlined />}
          //     onClick={() => {
          //       // handleOpenCreateModal();
          //     }}
          //     type="primary"
          //   >
          //     Thêm permission
          //   </Button>,
        ]}
      />
    </>
  );
};
export default PermissionAdmin;
