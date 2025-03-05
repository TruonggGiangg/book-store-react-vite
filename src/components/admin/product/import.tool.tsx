import { message, Modal, notification, Space, Table, TableProps, Upload, UploadProps } from "antd"
import { InboxOutlined } from '@ant-design/icons';
import { useState } from "react";
import Exceljs from 'exceljs'
import { createBookApi, createUserApi } from "@/services/api";
import templateFile from "@/assets/temple/sample_users.xlsx?url"
import dayjs from "dayjs";
// import { info } from "sass-embedded";

interface IProps {
    isOpenImportModal: boolean
    setIsOpenImportModal: (v: boolean) => void
    reload: () => void
}



const ImportTool = (props: IProps) => {
    const { isOpenImportModal, setIsOpenImportModal, reload } = props;

    const { Dragger } = Upload;

    const [api, contextHolder] = notification.useNotification();

    //table columns
    const columns: TableProps<ICreateBook>['columns'] = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            render: (authors?: string[]) => authors?.join(", ") || "N/A",
        },

        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'classification',
            dataIndex: ['attributes', 'classification'],
            key: 'classification',
        },
    ];

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        customRequest: ({ file, onSuccess }) => { if (onSuccess) { onSuccess("ok") } },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            if (status === 'done') {



                if (info.fileList && info.fileList.length > 0) {
                    // Lấy file
                    const file = info.fileList[0].originFileObj!;

                    //convert
                    const workBook = new Exceljs.Workbook();
                    const arrBuffer = await file.arrayBuffer();

                    console.log("Buffer Data:", arrBuffer);
                    await workBook.xlsx.load(arrBuffer);
                    console.log('arrBuffer', workBook)
                    console.log("File Type:", file.type);
                    console.log("File Name:", file.name);

                    // Chuyển đổi dữ liệu từ Excel sang JSON
                    let jsonData: ICreateBook[] = [];

                    workBook.worksheets.forEach(function (sheet) {
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;

                        let keys = firstRow.values as any[];

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber === 1) return;
                            let values = row.values as any[];
                            let obj: any = {};
                            for (let i = 0; i < keys.length; i++) {
                                obj[keys[i]] = values[i] || '';
                            }
                            if (typeof obj.author === 'string') {
                                obj.author = obj.author.split(',').map((item: string) => item.trim());
                            }
                            obj.logo = ""
                            obj.attributes = {
                                classification: obj.classification.split(',').map((item: string) => item.trim()),
                            }
                            jsonData.push(obj);
                            console.log('obj', obj)
                        });
                    });

                    setDataImport(jsonData);
                }


                // Gọi thông báo trong setTimeout để tránh lỗi concurrent mode
                api.success({
                    message: "Thành công",
                    description: `${info.file.name} đã được tải lên thành công.`
                });
            } else if (status === 'error') {

                api.error({
                    message: "Thất bại",
                    description: `${info.file.name} tải lên thất bại.`
                });

            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };


    const handleClose = () => {
        setIsOpenImportModal(false)
        console.log(isOpenImportModal)
    }

    const handleSubmit = async () => {
        const length = dataImport.length;
        let i = 0;
        if (length === 0) {
            api.warning({
                message: "Thất bại",
                description: `Dữ liệu trống.`
            })
        } else {
            await Promise.all(dataImport.map(async (book) => {
                book.isBook = false;
                const res = await createBookApi(book)
                if (res.data) {
                    i++;
                }
            }))
            api.info({
                message: "Thông báo",
                description: `Đã tải lên ${i} book. Thất bại ${length - i}`
            })
            setDataImport([]);
            setIsOpenImportModal(false);
            reload();
        }
    }

    const [dataImport, setDataImport] = useState<ICreateBook[]>([]);
    console.log("data", dataImport)
    return (
        <>
            {contextHolder}
            <Modal
                title="Import book"
                onOk={() => { handleSubmit() }}
                open={isOpenImportModal}
                onCancel={handleClose}
                width={'60%'}

            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag one file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx or
                        &nbsp;
                        <a href={templateFile} download onClick={e => e.stopPropagation()}>Download sample file</a>
                    </p>
                </Dragger>
                <Space />
                <Table
                    scroll={{ x: 2000 }}
                    dataSource={dataImport.map((item, index) => ({ ...item, key: index }))} columns={columns} />
            </Modal>
        </>
    )
}

export default ImportTool; 