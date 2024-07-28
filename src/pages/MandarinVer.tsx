import React, { useState, useEffect } from "react";
/* hooks */
import useAxios from "axios-hooks";
/* antd components and types  */
import { Table, Empty, Checkbox, Button, Popover } from "antd";
import type { TableProps } from "antd";

/* other */
import dayjs from "dayjs";

/* Components import */
import MainNav from "../Components/MainNav";
import FilterDropDown from "../Components/FilterDropDown";

/* types import */
import { DataType } from "../configRender/types";
import type { StatusType } from "../Components/MainNav";
import { initialValues } from "@/Components/SearchForm";
import Columns from "@/Components/Columns";
import { TableLocale } from "antd/es/table/interface";
import { CheckboxOptionType } from "antd/lib";
import { SettingOutlined } from "@ant-design/icons";

/** --------------import end ---------------- */

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

const MandarinVer = () => {
    // 第一列的狀態
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<DataType[]>([]);
    /* 分頁設定 */
    const [pagination, setPagination] = useState<number | undefined>(undefined);
    const [filterSelect, setFilterSelect] = useState<StatusType[]>(
        initialValues.fd_formStatus || []
    );
    /*  預設 table 表單狀態的filter  */
    const [filteredInfo, setFilteredInfo] = useState<Filters>({
        fd_formStatus: ["暫存", "階層陳核", "退文敘辦", "主管核決"],
    });
    // loading 狀態
    const [spinning, setSpinning] = useState(true);

    /* filter 搜尋 ，return按鈕及過濾功能、搜尋的文字 */
    const { searchText } = FilterDropDown();

    const { columns } = Columns({
        pagination,
        filteredInfo,
    });
    const defaultCheckedList = columns.map((item) => item.key as string);

    const [checkedList, setCheckedList] = useState(defaultCheckedList);

    const options = columns.map(({ key, title }) => ({
        label: title,
        value: key,
    }));

    const newColumns = columns.map((item) => ({
        ...item,
        hidden: !checkedList.includes(item.key as string),
    }));

    /* 載入資料 */
    const [{ data: fetchedData, loading, error }] = useAxios<any>({
        url: "/api/getNtFormData",
        method: "GET",
    });

    /* 載入資料狀態處理 */
    useEffect(() => {
        setTimeout(() => {
            if (loading) {
                setSpinning(true);
                return;
            }
            if (error) {
                alert("載入資料失敗！請聯繫資訊處管理人員！");
                // console.error(`error code ${error.response?.status}`, error);
                setSpinning(false);
                return;
            }

            if (fetchedData) {
                if (fetchedData.data.length === 0) {
                    alert("查無資料");
                } else {
                    setData(fetchedData.data);
                }
                setSpinning(false);
            }
        }, 300);
    }, [loading, error]);

    /* 及時更新 table 的變化 */
    const handleChange: OnChange = (pagination, filters, sorter) => {
        setPagination(pagination.current);
        console.log("Various parameters", pagination, filters, sorter);
        setFilteredInfo(filters);
    };

    /* filter 清空  */
    const clearFilters = () => {
        setFilteredInfo({});
    };

    // 搜尋表單處理
    const handleChildrenData = (searchData: any, values: any) => {
        setSpinning(true);

        // (MainNav 清除按鈕)重置資料
        if (!searchData) {
            resetData();
            return;
        }

        const { message, data } = searchData.data;
        setPagination(1);

        if (message === "success") {
            handleSuccess(data);
        } else if (message === "fail") {
            handleFailure();
        }
        setFilterSelect(values.fd_formStatus || []);
        setSpinning(false);
    };

    const resetData = () => {
        setData(fetchedData.data);
        setFilterSelect(initialValues.fd_formStatus);
        setSpinning(false);
    };

    const handleSuccess = (data: any) => {
        console.log("搜尋到的資料：", data);
        setData(data);
        clearFilters();
    };

    const handleFailure = () => {
        console.log("查無資料");
        setData([]);
    };

    const locale: TableLocale = {
        emptyText: (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={spinning ? "" : `沒有關於${searchText}的資料`}
            />
        ),
    };

    return (
        <>
            <Popover
                content={
                    <Checkbox.Group
                        value={checkedList}
                        options={options as CheckboxOptionType[]}
                        onChange={(value) => {
                            setCheckedList(value as string[]);
                        }}
                    />
                }
                title={<h3 style={{ textAlign: "center" }}>欄位選擇</h3>}
                trigger="click"
                placement="rightBottom"
            >
                <Button icon={<SettingOutlined />} type="primary">
                    自訂欄位
                </Button>
            </Popover>

            <MainNav
                handleChildrenData={handleChildrenData}
                data={data}
                filterSelect={filterSelect}
            />
            <Table
                onChange={handleChange}
                tableLayout="fixed"
                columns={newColumns}
                dataSource={data}
                loading={{
                    spinning: spinning,
                    tip: "加載中...",
                    size: "large",
                }}
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
                    columnWidth: "80px",
                    selections: [
                        Table.SELECTION_NONE,
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
        </>
    );
};

export default MandarinVer;
