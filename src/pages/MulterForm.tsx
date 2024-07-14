import React, { useState } from "react";
// import axios from "axios";
import { FlowEngine, NTForm } from "@/types"; // 假設這是類型定義文件的路徑

const initialFlowEngine: FlowEngine = {
    fd_flowType: "",
    fd_control: 0,
    fd_inFlow: [],
    fd_flow: [],
    fd_outControl: 0,
    fd_outFlow: [],
    fd_flowSetting: null,
    fd_counterSign: {
        fd_suggest: [],
        fd_useSuggest: false,
        fd_cancelSuggest: false,
        fd_suggestMaster: [],
        fd_useSuggestMaster: false,
        fd_cancelSuggestMaster: false,
        fd_list: [],
        fd_startTime: "",
        fd_isDone: false,
    },
    fd_docAuthor: {
        fd_LDAP: "",
        fd_hmDocID: "",
        fd_name: "",
        fd_wrkAffiliateUniNo: "",
        fd_wrkAffiliateName: "",
        fd_wrkDeptNo: "",
        fd_wrkDeptFullName: "",
        fd_wrkTitleName: "",
        fd_wrkDutyName: "",
        fd_wrkList: [],
        fd_powerKey: "",
    },
    fd_docSubAuthor: null,
    fd_fnTime: "",
    fd_lmTime: "",
    fd_formStatus: "待簽辦",
    fd_approvedTime: "",
    fd_isDone: false,
    fd_doneTime: "",
    fd_signedLogs: [],
    fd_readers: [],
    fd_readDeptNos: [],
    fd_roles: [],
    fd_counterSignSend: [],
    fd_approvedSendDepts: [],
    fd_approvedSendToMasters: [],
    fd_isEndApprovedMangerSend: false,
};

const initialNTForm: NTForm = {
    form: "ntForms", //固定
    formName: "創簽單", //固定
    fd_secNo: "", //使用者填寫
    fd_createTime: "", //後端自動生成
    fd_createAuthor: {
        fd_hmDocID: "",
        fd_LDAP: "",
        fd_name: "",
        fd_wrkDeptNo: "",
        fd_wrkDeptFullName: "",
        fd_wrkTitleName: "",
    },
    fd_subject: "", //使用者填寫
    fd_attach: [],
    fd_flowEngine: initialFlowEngine,
    fd_expound: "", //使用者填寫
    fd_schemes: "", //使用者填寫
    fd_links: [], //使用者填寫,
    fd_processAttach: [], //使用者填寫
    fd_upPrintedAttach: [], //使用者填寫
    fd_isHvDocument: false, //使用者填寫
    fd_hvDocCheck: false, //後端自動生成
};

const SignatureFormColumn: React.FC = () => {
    const [formData, setFormData] = useState<NTForm>(initialNTForm);

    // 處理 input 輸入
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => {
            const newFormData = { ...prevState };
            const nameParts = name.split(".");
            if (nameParts.length === 2) {
                (newFormData as any)[nameParts[0]][nameParts[1]] = value;
            } else {
                (newFormData as any)[nameParts[0]] = value;
            }
            return newFormData;
        });
    };

    // 處理checkbox
    // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, checked } = e.target;
    //     console.log(name);
    //     setFormData({ ...formData, [name]: checked });
    // };

    // 提交表單
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 先檢查表單是否有填寫
        if (
            !formData.fd_secNo ||
            !formData.fd_subject ||
            !formData.fd_createAuthor.fd_name ||
            !formData.fd_createAuthor.fd_wrkDeptFullName
        ) {
            alert("請填寫表單資料");
            return;
        }

        // 在這裡提交資料到後端
        fetch("/api/createForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const fields = [
        { label: "承辦人", name: "fd_createAuthor.fd_name", type: "text" },
        {
            label: "承辦單位",
            name: "fd_createAuthor.fd_wrkDeptFullName",
            type: "text",
        },
        {
            label: "主旨",
            name: "fd_subject",
            type: "text",
        },
        {
            label: "表單序號",
            name: "fd_secNo",
            type: "text",
        },

        // 添加其他字段信息
    ];

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            {fields.map((field) => (
                <label key={field.name}>
                    {field.label}:
                    <input
                        type={field.type}
                        name={field.name}
                        value={field.name
                            .split(".")
                            .reduce((acc, part) => acc[part], formData as any)}
                        onChange={handleInputChange}
                    />
                </label>
            ))}

            <button type="submit">提交</button>
        </form>
    );
};

export default SignatureFormColumn;
