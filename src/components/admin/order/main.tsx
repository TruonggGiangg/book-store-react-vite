// pages/OrderAdminMain.tsx
import { getAllOrderApi } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  EditOutlined,
  ExportOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, notification, Select } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import "@/style/table.scss";
import { useAppProvider } from "@/components/context/app.context";
import OrderDetail from "./detail.order";
import OrderUpdate from "./update.order";

type TSearch = {
  pageSize: number;
  current: number;
  createdAtRange?: string[];
  numberPhone?: string;
  status?: string;
  shippingAddress?: string;
};

const OrderAdminMain = () => {
  const { isDarkTheme } = useAppProvider();
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [dataOrderTable, setDataOrderTable] = useState<IGetOrder[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [dataDetailModal, setDataDetailModal] = useState<IGetOrder | null>(
    null
  );

  const reload = () => {
    actionRef.current?.reload();
  };

  const handleOpenDetailModal = (record: IGetOrder) => {
    setIsOpenDetailModal(true);
    setDataDetailModal(record);
  };

  const handleOpenUpdateModal = (record: IGetOrder) => {
    setIsOpenUpdateModal(true);
    setDataDetailModal(record);
  };

  const handleExport = () => {
    // Implement CSV export logic here
    api.info({ message: "Chức năng xuất CSV đang được phát triển" });
  };

  const columns: ProColumns<IGetOrder>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "_id",
      hideInSearch: true,
      copyable: true,
      ellipsis: true,
      tooltip: "ID đơn hàng",
      render: (_, record) => (
        <a onClick={() => handleOpenDetailModal(record)}>{record._id}</a>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      valueType: "select",
      // Dùng valueEnum chỉ trong phần search
      valueEnum: {
        pending: { text: "Chờ xử lý", status: "Warning" },
        processing: { text: "Đang xử lý", status: "Processing" },
        completed: { text: "Hoàn thành", status: "Success" },
        cancelled: { text: "Đã hủy", status: "Error" },
        default: { text: "Tất cả", status: "Default" },
      },
      // Custom form field để bỏ "Tất cả" trong form
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === "form") {
          return (
            <Select {...rest}>
              <Select.Option value="pending">Chờ xử lý</Select.Option>
              <Select.Option value="processing">Đang xử lý</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
          );
        }
        return defaultRender(_);
      },
      formItemProps: {
        rules: [{ required: true, message: "Vui lòng chọn trạng thái" }],
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "numberPhone",
      key: "numberPhone",
      copyable: true,
      valueType: "text", // 👈 thêm dòng này để ProTable hiển thị ô tìm kiếm
      ellipsis: true,
      tooltip: "Số điện thoại người nhận",
      render: (_, record) => (
        <a href={`tel:${record.numberPhone}`} style={{ color: "#ff5733" }}>
          {record.numberPhone}
        </a>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      hideInSearch: true,
      render: (_, record) => `${record.totalAmount.toLocaleString()} VND`,
    },
    {
      title: "Địa chỉ",
      dataIndex: "shippingAddress",
      copyable: true,
      ellipsis: true,
      valueType: "text",
      hideInSearch: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
      hideInSearch: true,
      render: (_, record) => dayjs(record.createdAt).format("YYYY-MM-DD"),
      sorter: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },
    {
      title: "Hành động",
      hideInSearch: true,
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <EditOutlined
            onClick={() => handleOpenUpdateModal(record)}
            style={{ cursor: "pointer", color: "#ff5733" }}
          />
          <MoreOutlined
            onClick={() => handleOpenDetailModal(record)}
            style={{ cursor: "pointer", color: "#ff5733" }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <h1 style={{ padding: 20 }}>Quản lý đơn hàng</h1>

      <OrderDetail
        isOpenDetailModal={isOpenDetailModal}
        setIsOpenDetailModal={setIsOpenDetailModal}
        dataDetailModal={dataDetailModal}
        setDataDetailModal={setDataDetailModal}
      />

      <OrderUpdate
        isOpen={isOpenUpdateModal}
        setIsOpen={setIsOpenUpdateModal}
        reload={reload}
        data={dataDetailModal}
      />

      <ProTable<IGetOrder, TSearch>
        direction="ltr"
        // rowClassName={(record, index) =>
        //     // index === 0
        //     //     ? isDarkTheme
        //     //         ? 'first-row-dark'
        //     //         : 'first-row'
        //     //     : index % 2 === 0
        //     //         ? isDarkTheme
        //     //             ? 'even-row-dark'
        //     //             : 'even-row'
        //     //         : isDarkTheme
        //     //             ? 'odd-row-dark'
        //     //             : 'odd-row'
        // }
        scroll={{ x: 1000 }}
        bordered
        columns={columns}
        dateFormatter="string"
        actionRef={actionRef}
        cardBordered
        options={{
          setting: true,
          fullScreen: true,
          reload: true,
          density: true,
        }}
        form={{
          initialValues: { status: "pending" },
        }}
        request={async (params, sort) => {
          console.log("params:", params); // 👈 debug ở đây
          let query = `current=${params.current}&pageSize=${params.pageSize}`;

          if (params.status) {
            if (params.status === "default") {
              // Không thêm gì vào query nếu chọn "Tất cả"
            } else {
              query += `&status=${params.status}`;
            }
          } else {
            query += `&status=pending`; // giá trị mặc định nếu không có gì được chọn
          }

          if (params.shippingAddress) {
            query += `&shippingAddress=${encodeURIComponent(
              params.shippingAddress
            )}`;
          }

          if (params.numberPhone) {
            query += `&numberPhone=${encodeURIComponent(params.numberPhone)}`;
          }

          const createDateRange = dateRangeValidate(params.createdAtRange);
          if (createDateRange && createDateRange.length === 2) {
            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
          }

          if (sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else {
            query += `&sort=-createdAt`;
          }

          const res = await getAllOrderApi(query);
          if (res.data) {
            setMeta(res.data.meta);
            setDataOrderTable(res.data.result);
          }

          return {
            data: res.data?.result || [],
            page: params.current,
            success: true,
            total: res.data?.meta.total || 0,
          };
        }}
        rowKey="_id"
        pagination={{
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          current: meta.current,
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} trên tổng {total} đơn hàng
            </div>
          ),
        }}
        headerTitle="Danh sách đơn hàng"
        toolBarRender={() => [
          // <Button
          //     key="create"
          //     icon={<PlusOutlined />}
          //     onClick={() => api.info({ message: 'Chức năng thêm đơn hàng đang được phát triển' })}
          //     type="primary"
          // >
          //     Thêm đơn hàng
          // </Button>,
          // <Button key="export" icon={<ExportOutlined />} onClick={handleExport}>
          //     Xuất CSV
          // </Button>,
        ]}
      />
    </>
  );
};

export default OrderAdminMain;
