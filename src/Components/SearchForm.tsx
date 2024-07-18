import {
    Button,
    Checkbox,
    Col,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
} from "antd";

import styles from "./comp.module.scss";

import type { DatePickerProps, FormProps } from "antd";

import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";

interface FormValues<T> {
    fd_name: string | undefined;
    fd_wrkDeptFullName: string | undefined;
    fd_subject: string | undefined;
    datePicker: T | undefined;
    fd_formStatus: string[];
}

interface Props {
    handleChidrenData: (d: any, value: FormValues<any>) => void;
}

// 表單狀態選項

const formStatusOptions = [
    "在途",
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
    const deparmentOptions = [
        "",
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

// 初始值
const initialValues = {
    fd_name: "",
    fd_wrkDeptFullName: "",
    fd_subject: "",
    datePicker: [dayjs().startOf("year"), dayjs()],
    fd_formStatus: ["在途", "暫存", "階層陳核", "退文敘辦", "主管核決"],
};

/**
 * Renders a search form component.
 *
 * @param {Props} props - The props for the component.
 * @param {Function} props.handleChidrenData - 父層要取得此組件資料的函式.
 * @return {JSX.Element} 查詢Component、使用者挑選的欄位資料.
 */
export default function SearchForm({ handleChidrenData }: Props) {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<FormValues<any>>(initialValues);

    const sendDatatoParent = (data: any, value: FormValues<any>) => {
        handleChidrenData(data, value);
    };

    /* Components */
    const { RangePicker } = DatePicker;

    /* Functions */

    /* 查詢按鈕事件 */
    const onFinish: FormProps["onFinish"] = (values) => {
        console.log(value);

        setLoading(true);
        if (!values.fd_formStatus) {
            console.log("請選擇表單狀態");
        }

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

    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Form: {
                            labelFontSize: 16,
                        },
                    },
                }}
            >
                <Form
                    size="large"
                    style={{ width: "670px" }}
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
                                    initialValue={value.fd_name}
                                    labelCol={{ span: 14 }}
                                >
                                    <Input
                                        name="fd_name"
                                        onChange={onChange}
                                        placeholder="全名"
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
                        initialValue={value.fd_subject}
                        labelCol={{ span: 5 }}
                    >
                        <Input
                            onChange={onChange}
                            name="fd_subject"
                            placeholder="請輸入主旨*關鍵字*"
                        />
                    </Form.Item>
                    <Form.Item label="表單狀態包括">
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
                    <div className={styles.btnGroup}>
                        <Button
                            name="search"
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            <SearchOutlined /> 查詢
                        </Button>
                        <Button
                            loading={loading}
                            name="reset"
                            type="default"
                            htmlType="reset"
                            onClick={() => {
                                setValue(initialValues);
                            }}
                        >
                            <ClearOutlined /> 清除
                        </Button>
                    </div>
                </Form>
            </ConfigProvider>
        </>
    );
}
