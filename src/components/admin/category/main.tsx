import { deleteUserApi, getAllCategoryApi, getAllUserApi } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, notification } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import '@/style/table.scss'
import { useAppProvider } from '@/components/context/app.context';
import UserDetail from './detail.category';
import { CSVLink } from 'react-csv';
import UserUpdate from './update.user';
import CategoryCreate from './create-modal.category';
import CategoryDetail from './detail.category';


//type cho api get
type TSearch = {
    pageSize: number;
    current: number;
    createdAtRange: string[]
    name: string;
    description: string;
    isBookSearch: boolean;
}



const CategoryAdminMain = () => {

    //TABLE
    const { isDarkTheme } = useAppProvider()

    const actionRef = useRef<ActionType>();

    const reload = () => {
        actionRef.current?.reload()
    }

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })


    //data colunm table
    const columns: ProColumns<IGetCategories>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: "ID",
            dataIndex: "_id",
            hideInSearch: true,
            copyable: true,
            ellipsis: true,
            tooltip: 'ID danh mục',
            render: (_, record) => { return <a onClick={() => { handleOpenDetailModal(record) }}>{`${record._id}`}</a> }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            copyable: true,
            ellipsis: true,
            tooltip: 'Tên thể loại',

        },
        {
            title: 'Sách/D.Cụ',
            dataIndex: 'isBook',
            copyable: true,
            ellipsis: true,
            tooltip: 'Sách hay là dụng cụ',
            render: (_, record) => { return <>{record.isBook ? "Sách" : "Dụng cụ"}</> },
            hideInSearch: true
        },

        {
            title: 'Sách/D.Cụ',
            dataIndex: 'isBookSearch',
            valueType: 'select',//true false
            valueEnum: {
                true: { text: 'Sách' },
                false: { text: 'Dụng cụ' }
            },
            hideInTable: true
        },


        {
            title: 'Created at',
            dataIndex: 'createdAt',
            valueType: 'date',
            hideInSearch: true,
            render: (_, record) => { return <>{dayjs(record.createdAt).format("YYYY-MM-DD")}</> },
            sorter: true
        },
        {
            title: 'Created at',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: "Action",
            hideInSearch: true,
            width: " 100px",
            render: (_, record) => {
                return (<>
                    <div style={{
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <EditOutlined onClick={() => {
                            handleOpenUpdateModal()
                            setDataDetailModal(record)
                        }} style={{ cursor: 'pointer', color: '#ff5733' }} />
                        <DeleteOutlined
                            style={{ cursor: 'pointer', color: '#ff5733' }}
                            onClick={() => { handleDelete(record._id) }}
                        />
                        <MoreOutlined
                            style={{ cursor: 'pointer', color: '#ff5733' }}
                            onClick={() => handleOpenDetailModal(record)}
                        />
                    </div>

                </>)
            }
        }

    ];

    const [dataUserTable, setDataUserTable] = useState<IGetCategories[]>([]);
    const [api, contextHolder] = notification.useNotification();

    //detail component
    const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
    const [dataDetailModal, setDataDetailModal] = useState<IGetCategories | null>(null);

    const handleOpenDetailModal = (record: IGetCategories) => {
        setIsOpenDetailModal(true);
        setDataDetailModal(record)
    }

    //create component
    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

    const handleOpenCreateModal = () => {
        setIsOpenCreateModal(true);
    }



    //import component
    const [isOpenImportModal, setIsOpenImportModal] = useState<boolean>(false);

    const handleOpenImportModal = () => {
        setIsOpenImportModal(true);
    }



    //update component
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);

    const handleOpenUpdateModal = () => {
        setIsOpenUpdateModal(true);
    }



    //logic export
    const handleExport = () => {

    }


    const handleDelete = async (id: string) => {
        const res = await deleteUserApi(id);
        if (res.data) {
            api.success({
                message: "Xóa thành công"
            })
            reload()
        } else {
            api.error({
                message: `${res.message}`
            })
        }
    }


    return (
        <>
            {contextHolder}

            <h1 style={{ padding: "20px" }}>Quản lý người dùng</h1>


            <CategoryCreate
                isOpenCreateModal={isOpenCreateModal}
                setIsOpenCreateModal={setIsOpenCreateModal}
                reload={reload}
            />


            <CategoryDetail
                isOpenDetailModal={isOpenDetailModal}
                setIsOpenDetailModal={setIsOpenDetailModal}
                dataDetailModal={dataDetailModal}
                setDataDetailModal={setDataDetailModal}

            />

            <UserUpdate
                isOpenUpdateModal={isOpenUpdateModal}
                setIsOpenUpdateModal={setIsOpenUpdateModal}
                reload={reload}
                dataDetailModal={dataDetailModal}
                setDatadetailModal={setDataDetailModal}
            />



            <ProTable<IGetCategories, TSearch>
                direction='ltr'
                rowClassName={(record, index) => {
                    if (index === 0) return isDarkTheme ? 'first-row-dark' : 'first-row'; // Hàng đầu tiên
                    return index % 2 === 0
                        ? isDarkTheme ? 'even-row-dark' : 'even-row'  // Hàng chẵn
                        : isDarkTheme ? 'odd-row-dark' : 'odd-row';  // Hàng lẻ
                }}
                scroll={{ x: 1000 }} // Giá trị x đặt lớn hơn tổng chiều rộng bảng
                bordered={true}
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


                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = `current=${params.current}&pageSize=${params.pageSize}`;



                    if (params.name) {
                        query += `&name=/${params.name}/i`;
                    }

                    if (params.isBookSearch) {
                        query += `&isBook=${params.isBookSearch}`;
                    }

                    const createDateRange = dateRangeValidate(params.createdAtRange);
                    if (createDateRange && createDateRange.length === 2) {
                        query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                    }


                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else {
                        query += `&sort=-createdAt`
                    }

                    const res = await getAllCategoryApi(query)
                    if (res.data) {
                        //set state meta

                        setMeta(res.data.meta)
                        //set data for logic
                        setDataUserTable(res.data.result)
                    }

                    return {
                        //tra du lieu
                        data: res.data?.result,
                        "page": params.current,
                        "success": true,
                        total: res.data?.meta.total
                    }

                }}

                rowKey="_id"
                pagination={{
                    // onChange: (page, pageSize) => { },
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    current: meta.current,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên tổng {total} sản phẩm</div>) }
                }}

                headerTitle="category Table"
                toolBarRender={() => [
                    <Button

                        icon={<PlusOutlined />}
                        onClick={() => {
                            handleOpenCreateModal()
                        }}
                        type="primary"
                    >
                        Thêm category
                    </Button>,

                ]}
            />
        </>

    );
};

export default CategoryAdminMain