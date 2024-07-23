/* antd components and types  */
import type { TableColumnsType } from "antd";

/* other */
import dayjs from "dayjs";
import Highlighter from "react-highlight-words";

// types import
import { DataType } from "../configRender/types";

import { colorConfig } from "../configRender/colorConfig";
import FilterDropDown from "./FilterDropDown";

/** --------------import end ---------------- */

interface ColumnsProps {
    pagination: number | undefined;
    filteredInfo: any;
}

/**
 * 根據提供的數據生成表格的列。
 *
 * @param {object} pagination - 分頁對象。
 * @param {object} filteredInfo - 篩選信息對象。
 * @return {object} 表格的列配置。
 */
export default function Columns({ pagination, filteredInfo }: ColumnsProps) {
    const { getColumnSearchProps, searchText } = FilterDropDown();

    const columns: TableColumnsType<DataType> = [
        {
            title: "序",
            width: "3%",
            align: "center",
            key: "index",
            // 第二頁繼續編號不要變成1
            render: (text, record, index) => {
                if (pagination) {
                    return index + 1 + (pagination - 1) * 10;
                }

                return index + 1;
            },
        },
        {
            title: "起單日期",
            dataIndex: "fd_createTime",
            key: "fd_createTime",
            width: "10%",
            align: "center",
            defaultSortOrder: "descend",
            sorter: (a, b) =>
                dayjs(a.fd_createTime).unix() - dayjs(b.fd_createTime).unix(),
        },
        {
            title: "承辦人",
            dataIndex: "fd_name",
            key: "fd_name",
            align: "center",
            width: "10%",
            filteredValue: filteredInfo.fd_name || null,

            ...getColumnSearchProps("fd_name"),
        },
        {
            title: "承辦單位",
            dataIndex: "fd_wrkDeptFullName",
            key: "fd_wrkDeptFullName",
            align: "center",
            width: "20%",
            filteredValue: filteredInfo.fd_wrkDeptFullName || null,
            ...getColumnSearchProps("fd_wrkDeptFullName"),
        },
        {
            title: "主旨",
            dataIndex: "fd_subject",
            key: "fd_subject",
            align: "center",
            width: "20%",
            filteredValue: filteredInfo.fd_subject || null,
            ...getColumnSearchProps("fd_subject"),
        },
        {
            title: "表單狀態",
            dataIndex: "fd_formStatus",
            key: "fd_formStatus",
            align: "center",
            width: "10%",
            filteredValue: filteredInfo.fd_formStatus || null,
            render: (status) => {
                let color;
                switch (status) {
                    case "階層陳核":
                        color = colorConfig["status"]["階層陳核"];
                        break;
                    case "暫存":
                    case "退文敘辦":
                        color = colorConfig["status"]["暫存"];
                        break;
                    case "作廢":
                        color = colorConfig["status"]["作廢"];
                        break;
                    case "主管核決":
                        color = colorConfig["status"]["主管核決"];
                        break;
                    case "核決":
                        color = colorConfig["status"]["核決"];
                        break;
                    default:
                        color = "black";
                        break;
                }
                return (
                    <span style={{ color }} key={status}>
                        {status}
                    </span>
                );
            },
            filters: [
                { text: "暫存", value: "暫存" },
                { text: "階層陳核", value: "階層陳核" },
                { text: "退文敘辦", value: "退文敘辦" },
                { text: "主管核決", value: "主管核決" },
                { text: "作廢", value: "作廢" },
                { text: "核決", value: "核決" },
            ],
            onFilter(value, record) {
                return record.fd_formStatus === value;
            },
        },
        {
            title: "表單序號",
            dataIndex: "fd_secNo",
            key: "fd_secNo",

            align: "center",
            filteredValue: filteredInfo.fd_secNo || null,
            ...getColumnSearchProps("fd_secNo"),
            render: (text, record) => (
                <a
                    onClick={() => {
                        console.log("表單序號點擊:", record.fd_secNo);
                    }}
                >
                    <Highlighter
                        highlightStyle={{
                            backgroundColor: "#ffc069",
                            padding: 0,
                        }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ""}
                    />
                </a>
            ),
        },
    ];

    return { columns };
}
