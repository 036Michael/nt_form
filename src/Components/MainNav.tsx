import { Space, Popover, Button } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";

import { colorConfig } from "@/configRender/colorConfig";

import SearchForm from "../Components/SearchForm";

import { DataType } from "@/configRender/types";
import { useCallback, useState } from "react";
interface Props {
    handleChildrenData: (d: any, value: any) => void;
    data: DataType[];
    filterSelect: StatusType[];
}

export type StatusType =
    | "暫存"
    | "退文敘辦"
    | "階層陳核"
    | "主管核決"
    | "核決"
    | "作廢";

export default function MainNav({
    handleChildrenData,
    data,
    filterSelect,
}: Props) {
    const [reset, setReset] = useState(false);

    // 計算表單狀態的數量
    const getStatusCount = useCallback(
        (status: StatusType) =>
            data.filter((item) => item.fd_formStatus === status).length,
        [data]
    );
    return (
        <div className="main-nav">
            {/* 計算個別表單狀態數量-顯示 */}
            <Space style={{ marginBottom: "1rem" }}>
                <h2>
                    總計：
                    {filterSelect.length > 0 ? (
                        filterSelect.map((status) => (
                            <span
                                key={status}
                                style={{
                                    color: colorConfig["status"][status],
                                    marginRight: "1rem",
                                }}
                            >
                                {status} ({getStatusCount(status)})
                            </span>
                        ))
                    ) : (
                        <span>{data.length}筆</span>
                    )}
                </h2>
            </Space>

            {/* 表單搜尋按鈕 */}
            <Space style={{ marginBottom: "1rem" }}>
                <Button
                    type="primary"
                    danger
                    icon={<ClearOutlined />}
                    htmlType="reset"
                    onClick={() => {
                        // 清除搜尋
                        setReset(true);
                        handleChildrenData(null, null);
                    }}
                >
                    清除搜尋
                </Button>
                <Popover
                    content={
                        <SearchForm
                            handleChildrenData={handleChildrenData}
                            reset={reset}
                            setReset={setReset}
                        />
                    }
                    title={<h2 style={{ textAlign: "center" }}>歷史查詢</h2>}
                    trigger="click"
                    placement="leftBottom"
                >
                    <Button icon={<SearchOutlined />} type="primary">
                        搜尋
                    </Button>
                </Popover>
            </Space>
        </div>
    );
}
