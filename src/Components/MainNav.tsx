import { Flex, Space, Popover, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useState } from "react";

import { colorConfig } from "@/configRender/colorConfig";

import SearchForm from "../Components/SearchForm";

import { DataType } from "@/configRender/types";

interface Props {
    handleChidrenData: (d: any, value: any) => void;
    data: DataType[];
}

export default function MainNav({ handleChidrenData, data }: Props) {
    return (
        <div>
            <Flex justify="space-between">
                <Space style={{ marginBottom: "1rem" }}>
                    <h2>
                        總計:
                        <span style={{ color: colorConfig["status"]["在途"] }}>
                            在途
                        </span>
                        {
                            data.filter((item) => item.fd_formStatus === "在途")
                                .length
                        }
                        ，
                        <span style={{ color: colorConfig["status"]["核決"] }}>
                            核決
                        </span>
                        {
                            data.filter((item) => item.fd_formStatus === "核決")
                                .length
                        }
                        ，
                    </h2>
                </Space>

                <Space style={{ marginBottom: "1rem" }}>
                    <Popover
                        content={
                            <SearchForm handleChidrenData={handleChidrenData} />
                        }
                        title={
                            <h2 style={{ textAlign: "center" }}>歷史查詢</h2>
                        }
                        trigger="click"
                        placement="leftBottom"
                    >
                        <Button icon={<SearchOutlined />} type="primary">
                            搜尋
                        </Button>
                    </Popover>
                </Space>
            </Flex>
        </div>
    );
}
