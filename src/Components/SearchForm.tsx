import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Row,
    Select,
} from "antd";

import styles from "./comp.module.scss";

// antd
import type { DatePickerProps, FormProps } from "antd";

import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
// types
import { StatusType } from "./MainNav";

// const
import { deparmentOptions } from "@/configRender/const";
/* Components */
const { RangePicker } = DatePicker;

interface FormValues<T> {
    fd_name: string | undefined;
    fd_wrkDeptFullName: string | undefined;
    fd_subject: string | undefined;
    datePicker: T | undefined;
    fd_formStatus: StatusType[];
}

interface Props {
    handleChildrenData: (d: any, value: FormValues<any>) => void;
    reset: boolean;
    setReset: React.Dispatch<React.SetStateAction<boolean>>;
}

// 表單狀態選項
const formStatusOptions: StatusType[] = [
    "暫存",
    "階層陳核",
    "退文敘辦",
    "主管核決",
    "核決",
    "作廢",
];

// 部門選項
const departmentOptions = () => {
    // 假設這是從後端取得的部門資料
    const dpNamesList = deparmentOptions.map((dpName) => ({
        label: dpName,
        value: dpName,
    }));
    return dpNamesList;
};

// 查詢初始值
export const initialValues: FormValues<any> = {
    fd_name: "",
    fd_wrkDeptFullName: "",
    fd_subject: "",
    datePicker: [dayjs().startOf("year"), dayjs()],
    fd_formStatus: ["暫存", "退文敘辦", "階層陳核", "主管核決"],
};

/**
 * Renders a search form component.
 *
 * @param {Props} props - The props for the component.
 * @param {Function} props.handleChildrenData - 父層要取得此組件資料的函式.
 * @return {JSX.Element} 查詢Component、使用者挑選的欄位資料.
 */
export default function SearchForm({
    handleChildrenData,
    reset,
    setReset,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<FormValues<any>>(initialValues);

    const sendDatatoParent = (data: any, value: FormValues<any>) => {
        handleChildrenData(data, value);
    };

    /* Functions */

    /* 查詢按鈕事件 */
    const onFinish: FormProps["onFinish"] = () => {
        console.log(value);
        try {
            setLoading(true);
            axios
                .post("/api/mangoSearch", {
                    value,
                })
                .then((res) => {
                    console.log("success:", res);
                    sendDatatoParent(res, value);
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
        } catch (err) {
            alert(err);
            console.log(err);
        }
    };

    const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    // 只能選擇1年內的日期
    const disabled6MonthsDate: DatePickerProps["disabledDate"] = (
        current,
        { from }
    ) => {
        if (from) {
            return Math.abs(current.diff(from, "years")) >= 1;
        }

        return false;
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setValue({ ...value, [e.target.name]: e.target.value });

        setValue({ ...value, [e.target.name]: e.target.value.trim() });
        // setValue({...value, fd_name: e.target.value})}
    };

    useEffect(() => {
        if (reset) {
            console.log(reset);
            setValue(initialValues);
            setReset(false);
        }
    }, [reset]);

    return (
        <>
            <Form
                id="searchForm"
                style={{ width: "900px" }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className={styles.searchForm}
                disabled={loading}
                // 取消enter
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
            >
                <Form.Item
                    required
                    label="起單日期(範圍)"
                    name="datePicker"
                    initialValue={value.datePicker}
                    wrapperCol={{ span: 12, offset: 0 }}
                >
                    <RangePicker
                        placeholder={["起始日期", "結束日期"]}
                        onChange={(e) => {
                            setValue({ ...value, datePicker: e });
                        }}
                        placement="topLeft"
                        disabledDate={disabled6MonthsDate}
                        className={styles.antInput}
                        allowClear={false}
                        format={"YYYY/MM/DD"}
                    />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                    <Row gutter={20}>
                        <Col span={9}>
                            <Form.Item
                                label="承辦人"
                                name="fd_name"
                                labelCol={{ span: 14 }}
                            >
                                <Input
                                    name="fd_name"
                                    onChange={onChange}
                                    placeholder="全名"
                                    value={value.fd_name}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={15}>
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
                                    onChange={(v) => {
                                        setValue({
                                            ...value,
                                            fd_wrkDeptFullName: v,
                                        });
                                    }}
                                    variant="outlined"
                                    options={departmentOptions()}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item
                    label="主旨(關鍵字)"
                    name="fd_subject"
                    labelCol={{ span: 5 }}
                >
                    <Input
                        onChange={onChange}
                        name="fd_subject"
                        placeholder="請輸入主旨*關鍵字*"
                        value={value.fd_subject}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    label="表單狀態包括"
                    labelCol={{ span: 5 }}
                    style={{ marginBottom: "0" }}
                    required
                >
                    {formStatusOptions.map((option) => (
                        <Checkbox
                            key={option}
                            value={option}
                            name="fd_formStatus"
                            checked={value.fd_formStatus.includes(option)}
                            onChange={(e) => {
                                const updatedFormStatus = e.target.checked
                                    ? [...value.fd_formStatus, option]
                                    : value.fd_formStatus.filter(
                                          (item) => item !== option
                                      );

                                setValue({
                                    ...value,
                                    fd_formStatus: updatedFormStatus,
                                });
                            }}
                        >
                            {option}
                        </Checkbox>
                    ))}
                </Form.Item>
                <Divider style={{ margin: "10px 0 20px 0" }} />
                <div className={styles.btnGroup}>
                    <Button
                        style={{ height: "50px" }}
                        name="search"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        <SearchOutlined /> 查詢
                    </Button>

                    <Button
                        style={{ height: "50px" }}
                        name="reset"
                        danger
                        htmlType="reset"
                        type="default"
                        onClick={() => {
                            setValue(initialValues);
                        }}
                    >
                        <EditOutlined /> 預設
                    </Button>
                </div>
            </Form>
        </>
    );
}
