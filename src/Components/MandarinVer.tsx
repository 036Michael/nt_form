import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Space, Table, Divider, Switch, Empty } from "antd";
import { DownOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType, TableProps } from "antd";

import useAxios from "axios-hooks";
import type { FilterDropdownProps } from "antd/es/table/interface";

import dayjs from "dayjs";
import Highlighter from "react-highlight-words"; // 引入react-highlight-words庫
import SearchForm from "./SearchForm";

interface DataType {
    fd_createTime: string;
    fd_doneTime: string;
    fd_formStatus: string;
    fd_name: string;
    fd_secNo: string;
    fd_subject: string;
    fd_wrkDeptFullName: string;
    key: string;
}

type DataIndex = keyof DataType;

const MandarinVer = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<DataType[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [isToggled, setIsToggled] = useState<boolean>(false);

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
                style={{ color: filtered ? "#1677ff" : undefined }}
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
            title: "起單日期",
            dataIndex: "fd_createTime",
            key: "fd_createTime",
            width: "8%",
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
            width: "8%",

            ...getColumnSearchProps("fd_name"),
        },
        {
            title: "承辦單位",
            dataIndex: "fd_wrkDeptFullName",
            key: "fd_wrkDeptFullName",
            width: "15%",
            align: "center",

            ...getColumnSearchProps("fd_wrkDeptFullName"),
        },
        {
            title: "主旨",
            dataIndex: "fd_subject",
            key: "fd_subject",
            width: "15%",
            align: "center",
            ...getColumnSearchProps("fd_subject"),
        },
        {
            title: "表單狀態",
            dataIndex: "fd_formStatus",
            key: "fd_formStatus",
            align: "center",
            width: "7%",
            defaultFilteredValue: ["在途"],
            render: (status) => {
                let color;
                switch (status) {
                    case "在途":
                        color = "orange";
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
            ],
            onFilter: (value, record) => record.fd_formStatus === value, // 使用外部定义的过滤函数
        },
        {
            title: "表單序號",
            dataIndex: "fd_secNo",
            key: "fd_secNo",
            width: "8%",
            align: "center",
            ...getColumnSearchProps("fd_secNo"),
            render: (text, record) => (
                <a
                    onClick={() => {
                        console.log("表單序號點擊:", record.fd_secNo);
                        // 這裡添加你的點擊處理邏輯
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
            }
        } else {
            console.log("no data");
            setData([]);
        }
    }, [fetchedData]);

    const handleChidrenData = (searchData: any) => {
        const { message, data } = searchData.data;
        if (message === "success") {
            // sortDataFn(data.data);
            console.log("搜尋到的資料：", data);
            setData(data);
        } else if (message === "fail") {
            console.log("查無資料");
            setData([]);
        }
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

    const handleToggle = (checked: boolean) => {
        setIsToggled(checked);
    };

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
            {error && <p>取得資料時發生錯誤</p>}

            <div className="dividerToggle">
                <div>
                    <span>功能選項 </span>
                    <Switch
                        checked={isToggled}
                        onChange={handleToggle}
                        checkedChildren="開啟"
                        unCheckedChildren="關閉"
                        defaultChecked
                    />
                </div>

                <Divider plain>
                    {isToggled ? <DownOutlined /> : <UpOutlined />}
                </Divider>
                {isToggled && (
                    <div className="groupOptions">
                        <SearchForm handleChidrenData={handleChidrenData} />
                    </div>
                )}
            </div>

            <Space style={{ marginBottom: "1rem" }}>
                <h2>選項總計：{selectedRowKeys.length}</h2>
            </Space>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                locale={locale}
                pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                bordered
                size="middle"
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys) => setSelectedRowKeys(keys),
                    type: "checkbox",
                    columnWidth: "3%",
                    selections: [
                        Table.SELECTION_NONE,
                        Table.SELECTION_ALL,
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
                    ],
                }}
            />
        </div>
    );
};

export default MandarinVer;
