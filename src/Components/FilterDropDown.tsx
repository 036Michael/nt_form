import { useRef, useState } from "react";
/* hooks */
/* antd components and types  */
import { Button, Input, Space } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType } from "antd";
import type { FilterConfirmProps } from "antd/es/table/interface";

/* other */
import Highlighter from "react-highlight-words";

// types import
import { DataType } from "../configRender/types";

type DataIndex = keyof DataType;

/**
 * 定義 FilterDropDown 元件功能的函數，包括處理搜尋、重置和過濾操作。
 *
 * @param {string[]} selectedKeys - 用於過濾的選定鍵
 * @param {FilterDropdownProps["confirm"]} confirm - 用於過濾的確認函數
 * @param {DataIndex} dataIndex - 正在過濾的資料索引
 * @return {TableColumnType<DataType>} 包含列搜尋屬性和搜尋文字的物件
 */
export default function FilterDropDown() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);

    const handleReset = (
        clearFilters: () => void,
        confirm: (param?: FilterConfirmProps) => void
    ) => {
        clearFilters();
        setSearchText(""); // 重置searchText
        confirm({ closeDropdown: false }); // 確認以刷新表格
    };

    const getColumnSearchProps = <T extends DataIndex>(
        dataIndex: T
    ): TableColumnType<DataType> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{ padding: 8, display: "flex" }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Escape") {
                        close();
                    }
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex.replace("fd_", "")}`}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                        confirm({ closeDropdown: false });
                        setSearchText(e.target.value);
                        setSearchedColumn(dataIndex);
                    }}
                    style={{
                        width: 188,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters, confirm)
                        }
                        type="primary"
                        icon={<ClearOutlined />}
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
            // 過濾器
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            // 按下搜尋按鈕時，自動focus到input
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069" }}
                    searchWords={[searchText]}
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    return { getColumnSearchProps, searchText };
}
