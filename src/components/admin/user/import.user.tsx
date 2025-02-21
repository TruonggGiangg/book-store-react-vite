import { message, Modal, notification, Space, Table, TableProps, Upload, UploadProps } from "antd"
import { InboxOutlined } from '@ant-design/icons';
import { useState } from "react";
import Exceljs from 'exceljs'
import { createUserApi } from "@/services/api";
import templateFile from "@/assets/temple/sample_users.xlsx?url"
// import { info } from "sass-embedded";

interface IProps {
    isOpenImportModal: boolean
    setIsOpenImportModal: (v: boolean) => void
    reload: () => void
}



const ImportUser = (props: IProps) => {
    const { isOpenImportModal, setIsOpenImportModal, reload } = props;

    const { Dragger } = Upload;

    const [api, contextHolder] = notification.useNotification();

    //table columns
    const columns: TableProps<ICreateUser>['columns'] = [

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
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


                    await workBook.xlsx.load(arrBuffer);


                    // Chuyển đổi dữ liệu từ Excel sang JSON
                    let jsonData: ICreateUser[] = [];

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
            await Promise.all(dataImport.map(async (userData) => {
                const res = await createUserApi(userData)
                if (res.data) {
                    i++;
                }
            }))
            api.info({
                message: "Thông báo",
                description: `Đã tải lên ${i} user. Thất bại ${length - i}`
            })
            setDataImport([]);
            setIsOpenImportModal(false);
            reload();
        }
    }

    const [dataImport, setDataImport] = useState<ICreateUser[]>([]);
    console.log("data", dataImport)
    return (
        <>
            {contextHolder}
            <Modal
                title="Import user"
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
                <Table dataSource={dataImport.map((item, index) => ({ ...item, key: index }))} columns={columns} />
            </Modal>
        </>
    )
}

export default ImportUser; ``