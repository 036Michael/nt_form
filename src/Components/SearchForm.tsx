import { Button, DatePicker, Form, Input, Select } from "antd";
import type { DatePickerProps, FormProps } from "antd";

import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

interface FormValues<T> {
    fd_name: string | undefined;
    fd_wrkDeptFullName: string | undefined;
    fd_subject: string | undefined;
    datePicker: T | undefined;
}

interface Props {
    handleChidrenData: (d: any) => void;
}

// 部門選項
const departmentOptions = () => {
    // 假設這是從後端取得的部門資料
    const deparmentOptions = [
        "資訊處行政資訊發展室系統開發組",
        "系統開發組",
        "行管系",
        "資訊處行政資訊發展室",
        "行政資訊發展組",
        "資訊處",
        "校長室",
        "教務處",
        // ...自行添加
    ];

    const dpNamesList = deparmentOptions.map((dpName) => ({
        label: dpName,
        value: dpName,
    }));

    return dpNamesList;
};

export default function SearchForm({ handleChidrenData }: Props) {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<FormValues<any>>({
        fd_name: "",
        fd_wrkDeptFullName: "",
        fd_subject: "",
        datePicker: [dayjs().date(1), dayjs().endOf("month")],
    });

    const sendDatatoParent = (data: any) => {
        handleChidrenData(data);
    };

    /* Components */
    const { RangePicker } = DatePicker;

    /* Functions */

    /* 查詢按鈕事件 */
    const onFinish: FormProps["onFinish"] = (values) => {
        setLoading(true);
        axios
            .post("/api/mangoSearch", {
                values,
            })
            .then((res) => {
                console.log("success:", res);
                sendDatatoParent(res);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    console.log(err.response.data.error);
                    setLoading(false);
                    alert(err.response.data.error);
                    return;
                }

                console.log("error:", err);
                setLoading(false);
            });
    };

    const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    // 只能選擇 31 天內的日期
    const disabled31DaysDate: DatePickerProps["disabledDate"] = (
        current,
        { from }
    ) => {
        if (from) {
            return Math.abs(current.diff(from, "days")) >= 31;
        }

        return false;
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    return (
        <>
            <h1>精確匹配搜尋</h1>
            <Form
                name="精確匹配搜尋"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                {...formItemLayout}
                variant="filled"
                style={{ maxWidth: 600, margin: "auto" }}
            >
                <Form.Item
                    label="承辦人"
                    name="fd_name"
                    initialValue={value.fd_name}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="承辦單位(處)"
                    name="fd_wrkDeptFullName"
                    initialValue={value.fd_wrkDeptFullName}
                >
                    <Select
                        showSearch
                        placeholder="選擇承辦單位(處)"
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        options={departmentOptions()}
                    />
                </Form.Item>
                <Form.Item
                    label="主旨（關鍵字）"
                    name="fd_subject"
                    initialValue={value.fd_subject}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="起單日期（範圍）"
                    name="datePicker"
                    rules={[{ required: false, message: "Please input!" }]}
                    initialValue={value.datePicker}
                >
                    <RangePicker
                        placeholder={["起始日期", "結束日期"]}
                        placement="topLeft"
                        disabledDate={disabled31DaysDate}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 5, span: 15 }}>
                    <Button
                        name="search"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        查詢
                    </Button>
                    <Button
                        loading={loading}
                        name="reset"
                        type="default"
                        htmlType="reset"
                    >
                        清除查詢
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
