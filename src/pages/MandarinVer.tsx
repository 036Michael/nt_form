import React, { useRef, useState, useEffect } from "react";
import {
    Button,
    Input,
    Space,
    Table,
    Empty,
    Popover,
    Flex,
    ConfigProvider,
    message,
    FloatButton,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import zhTW from "antd/lib/locale/zh_TW";
import type { InputRef, TableColumnType, TableProps } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import useAxios from "axios-hooks";
import dayjs from "dayjs";
import Highlighter from "react-highlight-words";

// Components
import MainNav from "../Components/MainNav";
// types
import { DataType } from "../configRender/types";

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type DataIndex = keyof DataType;

import { colorConfig } from "../configRender/colorConfig";

const MandarinVer = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<DataType[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [pagination, setPagination] = useState<number | undefined>(undefined);
    
    const [filteredInfo, setFilteredInfo] = useState<Filters>({
        fd_formStatus: ["在途", "暫存"],
    });

    const handleChange: OnChange = (pagination, filters, sorter) => {
        setPagination(pagination.current);
        console.log("Various parameters", pagination, filters, sorter);
        setFilteredInfo(filters);
    };

    const clearFilters = () => {
        setFilteredInfo({});
    };

    const getColumnSearchProps = <T extends DataIndex>(
        dataIndex: T
    ): TableColumnType<DataType> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(
                            selectedKeys as string[],
                            confirm,
                            dataIndex
                        )
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(
                                selectedKeys as string[],
                                confirm,
                                dataIndex
                            )
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜尋
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters, confirm)
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        清除
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                    fontSize: "1.2rem",
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    // 表格欄位設定
    const columns: TableProps<DataType>["columns"] = [
        {
            title: "序",
            width: "2%",
            align: "center",
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
            width: "5%",
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
            width: "5%",
            filteredValue: filteredInfo.fd_name || null,

            ...getColumnSearchProps("fd_name"),
        },
        {
            title: "承辦單位",
            dataIndex: "fd_wrkDeptFullName",
            key: "fd_wrkDeptFullName",
            width: "12%",
            align: "center",
            filteredValue: filteredInfo.fd_wrkDeptFullName || null,
            ...getColumnSearchProps("fd_wrkDeptFullName"),
        },
        {
            title: "主旨",
            dataIndex: "fd_subject",
            key: "fd_subject",
            width: "15%",
            align: "center",
            filteredValue: filteredInfo.fd_subject || null,
            ...getColumnSearchProps("fd_subject"),
        },
        {
            title: "表單狀態",
            dataIndex: "fd_formStatus",
            key: "fd_formStatus",
            align: "center",
            width: "5%",
            filteredValue: filteredInfo.fd_formStatus || null,
            render: (status) => {
                let color;
                switch (status) {
                    case "在途":
                    case "階層陳核":
                        color = colorConfig["status"]["在途"];
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
                { text: "在途", value: "在途" },
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
            width: "10%",
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

    const [{ data: fetchedData, loading, error }] = useAxios({
        url: "/api/getNtFormData",
        method: "GET",
    });

    // api取回來的資料處理
    useEffect(() => {
        if (fetchedData) {
            if (fetchedData.data.length > 0) {
                setData(fetchedData.data);

                // success();
            } else {
                console.log("no data");
                setData([]);
                warning();
            }
        }
    }, [fetchedData]);

    // 搜尋表單處理
    const handleChidrenData = (searchData: any, values: any) => {
        const { message, data } = searchData.data;
        setPagination(1); // 重置頁數
        if (message === "success") {
            console.log("搜尋到的資料：", data);

            setData(data);
            clearFilters();
            successSearch();
        } else if (message === "fail") {
            console.log("查無資料");
            warning();
            setData([]);
        }

        // Highlight
        console.log("搜尋到的值：", values);
    };

    const handleReset = (clearFilters: () => void, confirm: () => void) => {
        clearFilters();
        setSearchText(""); // 重置searchText
        confirm(); // 確認以刷新表格
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps["confirm"],
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const errorMessage = () => {
        messageApi.open({
            type: "error",
            content: `${error}`,
        });
    };

    const successSearch = () => {
        messageApi.open({
            type: "success",
            content: `成功取得資料`,
        });
    };

    const warning = () => {
        messageApi.open({
            type: "warning",
            content: "查無資料",
        });
    };

    useEffect(() => {
        if (error) {
            errorMessage();
        }
    });

    const locale = {
        emptyText: (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={`沒有關於${searchText}的資料`}
            />
        ),
    };

    return (
        <div>
            {contextHolder}

            <MainNav handleChidrenData={handleChidrenData} data={data} />

            <FloatButton
                icon={<SearchOutlined />}
                type="primary"
                onClick={() => {
                    console.log("click");
                }}
            />

            <ConfigProvider locale={zhTW}>
                <Table
                    onChange={handleChange}
                    tableLayout="fixed"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    locale={locale}
                    pagination={{
                        pageSize: 10,
                        position: ["bottomCenter"],
                        current: pagination,
                    }}
                    bordered
                    size="middle"
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys) => setSelectedRowKeys(keys),
                        type: "checkbox",
                        columnWidth: "3%",
                        selections: [
                            Table.SELECTION_NONE,
                            Table.SELECTION_INVERT,
                            {
                                key: "today",
                                text: "選擇今天",
                                onSelect: () => {
                                    const today = dayjs().format("YYYY-MM-DD");
                                    setSelectedRowKeys(
                                        data
                                            .filter(
                                                (item) =>
                                                    item.fd_createTime === today
                                            )
                                            .map((item) => item.key)
                                    );
                                },
                            },
                            {
                                key: "today",
                                text: "選擇在途",
                                onSelect: () => {
                                    setSelectedRowKeys(
                                        data
                                            .filter(
                                                (item) =>
                                                    item.fd_formStatus ===
                                                    "在途"
                                            )
                                            .map((item) => item.key)
                                    );
                                },
                            },
                        ],
                    }}
                />
            </ConfigProvider>
        </div>
    );
};

export default MandarinVer;
