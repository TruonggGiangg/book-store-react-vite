import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppProvider } from "@/components/context/app.context";
import { dateRangeValidate } from "@/services/helper";
import { deleteBookApi, getAllBookApi, getAllCategoryApi, getCategoryApi } from "@/services/api";
import { t } from "i18next";
import BookDetail from "./detail.book";
import { Button, notification } from "antd";
import AddBook from "./create.book";
import UpdateProduct from "./update.book";
import { CSVLink } from "react-csv";
import ImportBook from "./import.product";
const TableBook = () => {

    const { isDarkTheme } = useAppProvider()
    const [dataBookTable, setDataBookTable] = useState<IGetBook[]>([])
    const actionRef = useRef<ActionType>();
    const [api, contextHolder] = notification.useNotification();

    const [classification, setClassification] = useState<IGetCategories[]>([])

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    })


    const reload = () => {
        actionRef.current?.reload()
    }

    useEffect(() => {
        const get = async () => {
            const res = await getAllCategoryApi();
            if (res.data?.result) {
                // Lọc ra các danh mục có `isBook === true`
                const newRes: IGetCategories[] = res.data.result.filter(x => x.isBook === true);
                setClassification(newRes);
            } else {
                setClassification([]);
            }
        };
        get();
    }, []);


    const columnsBook: ProColumns<IGetBook>[] = [
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
            tooltip: 'ID người dùng',
            render: (_, record) => { return <a onClick={() => { handleOpenDetailModal(record) }}>{`${record._id}`}</a> }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            copyable: true,
            ellipsis: true,
            tooltip: 'Tựa đề sách',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            copyable: true,
            ellipsis: true,
            tooltip: 'Tác giả của sách',
            render: (_, record) => { return <>{record.author.join(', ')}</> }
        },

        {
            title: 'NXB',
            dataIndex: 'publisher',
            copyable: true,
            ellipsis: true,
            tooltip: 'Nhà xuất bản của sách',

            render: (_, record) => {
                return <>{record.attributes?.publisher}</>
            }
        },

        {
            title: 'Ngày XB',
            dataIndex: 'publishedDate',
            copyable: true,
            ellipsis: true,
            hideInSearch: true,
            tooltip: 'Nhà xuất bản của sách',
            sorter: true,
            render: (_, record) => {
                return <>{dayjs(record.attributes?.publishedDate).format("YYYY-MM-DD")}</>
            }
        },

        {
            title: 'Thể loại',
            dataIndex: 'classification',
            copyable: true,
            valueType: "select",
            ellipsis: true,
            hideInTable: true,
            tooltip: 'Thể loại bản của sách',
            fieldProps: {
                showSearch: true, // Cho phép tìm kiếm
                options: classification.map(item => ({
                    label: item.name,
                    value: item._id
                }))
            }

        },

        {
            title: 'Ngày XB',
            dataIndex: 'publishedDateRange',
            valueType: 'dateRange',
            tooltip: 'Ngày xuất bản của sách',
            hideInTable: true
        },

        //
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            valueType: 'date',
            hideInSearch: true,
            render: (_, record) => {

                return <>{dayjs(record.createdAt).format("YYYY-MM-DD")
                }</>
            },
            sorter: true
        },
        {
            title: 'Created at',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },

        {
            title: 'Giá',
            dataIndex: 'price',
            copyable: true,
            ellipsis: true,
            tooltip: 'Giá của sách',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Số lượng tồn',
            dataIndex: 'stock',
            copyable: true,
            ellipsis: true,
            tooltip: 'Số lượng tồn của sách',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: "Action",
            hideInSearch: true,
            width: " 100px",
            fixed: 'right',
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


    //detail book
    const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
    const [dataDetailModal, setDataDetailModal] = useState<IGetBook | null>(null);

    const handleOpenDetailModal = (record: IGetBook) => {
        setIsOpenDetailModal(true);
        setDataDetailModal(record)
    }



    //create book
    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
    const handleOpenCreateModal = () => {
        setIsOpenCreateModal(true);
    }

    //update book
    //update component
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);

    const handleOpenUpdateModal = () => {
        setIsOpenUpdateModal(true);
    }

    //delete book
    const handleDelete = async (id: string) => {
        const res = await deleteBookApi(id);
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


    //import component
    const [isOpenImportModal, setIsOpenImportModal] = useState<boolean>(false);

    const handleOpenImportModal = () => {
        setIsOpenImportModal(true);
    }


    return (
        <div>

            <BookDetail
                isOpenDetailModal={isOpenDetailModal}
                setIsOpenDetailModal={setIsOpenDetailModal}
                dataDetailModal={dataDetailModal}
                setDataDetailModal={setDataDetailModal}
            />

            <AddBook
                isOpenCreateModal={isOpenCreateModal}
                setIsOpenCreateModal={setIsOpenCreateModal}
                reload={reload}
                isBook={true}
            />

            <UpdateProduct
                reload={reload}
                isOpenUpdateModal={isOpenUpdateModal}
                setIsOpenUpdateModal={setIsOpenUpdateModal}
                isBook={true}
                dataDetail={dataDetailModal}
                setDataDetail={setDataDetailModal}
            />

            <ImportBook
                isOpenImportModal={isOpenImportModal}
                setIsOpenImportModal={setIsOpenImportModal}
                reload={reload}
            />

            <ProTable<IGetBook, any>

                direction='ltr'
                rowClassName={(record, index) => {
                    if (index === 0) return isDarkTheme ? 'first-row-dark' : 'first-row'; // Hàng đầu tiên
                    return index % 2 === 0
                        ? isDarkTheme ? 'even-row-dark' : 'even-row'  // Hàng chẵn
                        : isDarkTheme ? 'odd-row-dark' : 'odd-row';  // Hàng lẻ
                }}
                scroll={{ x: 2000 }} // Giá trị x đặt lớn hơn tổng chiều rộng bảng
                bordered={true}
                columns={columnsBook}
                dateFormatter="string"
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = `current=${params.current}&pageSize=${params.pageSize}`;

                    if (params.title) {
                        query += `&title=/${params.title}/i`;
                    }

                    if (params.author) {
                        query += `&author=/${params.author}/i`;
                    }

                    if (params.publisher) {
                        query += `&attributes.publisher=/${params.publisher}/i`;
                    }

                    if (params.classification) {
                        query += `&attributes.classification=/${params.classification}/i`;
                    }

                    query += `&isBook=true`;

                    const createDateRange = dateRangeValidate(params.createdAtRange);
                    if (createDateRange && createDateRange.length === 2) {
                        query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                    }


                    const publishedDateRange = dateRangeValidate(params.publishedDateRange);

                    if (publishedDateRange && publishedDateRange.length === 2) {
                        query += `&attributes.publishedDate>=${publishedDateRange[0]}&attributes.publishedDate<=${publishedDateRange[1]}`;
                    }


                    if (sort) {
                        const sortParams: string[] = [];

                        if (sort.createdAt) {
                            sortParams.push(sort.createdAt === "ascend" ? "createdAt" : "-createdAt");
                        }
                        if (sort.publishedDate) {
                            sortParams.push(sort.publishedDate === "ascend" ? "attributes.publishedDate" : "-attributes.publishedDate");
                        }

                        if (sort.price) {
                            sortParams.push(sort.price === "ascend" ? "price" : "-price");
                        }

                        if (sort.stock) {
                            sortParams.push(sort.stock === "ascend" ? "stock" : "-stock");
                        }

                        if (sortParams.length > 0) {
                            query += `&sort=${sortParams.join(",")}`;
                        } else {
                            query += `&sort=-createdAt`;
                        }
                    }

                    const res = await getAllBookApi(query)
                    if (res.data) {
                        //set state meta
                        setMeta(res.data.meta)
                        //set data for logic
                        setDataBookTable(res.data.result)
                    }
                    return {
                        //tra du lieu
                        data: res.data?.result || [],
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
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên tổng {total} người dùng</div>) }
                }}

                headerTitle="Book Table"
                toolBarRender={() => [
                    <Button

                        icon={<PlusOutlined />}
                        onClick={() => {
                            handleOpenCreateModal()
                        }}
                        type="primary"
                    >
                        Thêm sản phẩm
                    </Button>,
                    <Button

                        icon={<ImportOutlined />}
                        onClick={() => {
                            handleOpenImportModal()
                        }}
                        type="primary"
                    >
                        Import sản phẩm
                    </Button>,

                    <Button

                        icon={<ExportOutlined />}
                        onClick={() => {
                            // handleExport()
                        }}
                        type="primary"
                    >
                        <CSVLink title='data_user_export' data={dataBookTable}>Export sản phẩm</CSVLink>
                    </Button>,
                ]}
            />
        </div>
    )

}
export default TableBook