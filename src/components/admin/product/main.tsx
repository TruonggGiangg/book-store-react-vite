import { useAppProvider } from "@/components/context/app.context";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { getAllBookApi } from "@/services/api";
import { Card, Switch } from "antd";
import { t } from "i18next";
import { dateRangeValidate } from "@/services/helper";
import TableBook from "./table.book";
import TableTool from "./table.tool";



const BookAdminMain = () => {
    const [isBook, setIsBook] = useState<boolean>(true);
    return (
        <div>
            <div

                style={{
                    display: "flex",
                    padding: "20px",
                    alignItems: "center",
                    gap: "12px"
                }}
            >
                <Switch
                    onChange={() => {
                        setIsBook(!isBook);
                    }}
                    checkedChildren={"Tool"}
                    unCheckedChildren={"Book"}
                    style={{
                        marginTop: "4px"
                    }}
                    title="Sách/Dụng cụ"
                />
                <h1

                    style={{

                    }}>
                    Quản lí {isBook ? "sách" : "dụng cụ"}
                </h1>

            </div>

            {
                isBook === true
                    ?
                    <TableBook />
                    :
                    <TableTool />
            }
        </div>
    )
}

export default BookAdminMain;