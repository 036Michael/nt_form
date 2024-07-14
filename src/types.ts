/** 部門節點 */
export interface DeptNode {
    /** 編碼 */
    fd_no: string;
    /** 名稱 */
    fd_name: string;
}

/** 個人資訊 */
export interface User {
    /** 個人唯一碼 */
    fd_LDAP: string;
    /** 個人身份唯一碼(不同部門/職稱) */
    fd_hmDocID: string;
    /** 姓名 */
    fd_name: string;
    /** 志業體別唯一碼 */
    fd_wrkAffiliateUniNo: string;
    /** 志業體別名稱 */
    fd_wrkAffiliateName: string;
    /** 現職部門編碼 */
    fd_wrkDeptNo: string;
    /** 現職部門名稱 */
    fd_wrkDeptFullName: string;
    /** 現職職稱 */
    fd_wrkTitleName: string;
    /** 現職職務 */
    fd_wrkDutyName: string;
    /** 現職部門階層 */
    fd_wrkList: DeptNode[];
}

/** 流程節點 */
export interface FlowNode extends User {
    /** 權限清單 */
    fd_powerKey: string;
    /** 動作清單, 非簽核者時, 在 docAuthor 中無此欄位 */
    fd_actionKeys?: string;
    /** 會簽層級 */
    fd_counterSignLevel?: number;
    /** 表單狀態(用於核後承辦單位流程) */
    fd_formStatus?: string;
    /** 簽核天數 */
    fd_day?: number;
}

/** 簽核設定 */
export interface FlowSetting {
    /** 核決者於 flow 中的 index, 由 0 開始 */
    fd_index: number;
    fd_hmDocID: string;
    fd_LDAP: string;
    fd_name: string;
    fd_wrkTitleName: string;
    fd_wrkDeptNo: string;
    fd_wrkDeptFullName: string;
}

/** 簽核紀錄 */
export interface SignedLog {
    fd_formStatus: string;
    fd_signer: FlowNode;
    fd_subSigner?: FlowNode;
    fd_limitTime: string;
    fd_signedTime: string;
    fd_comment: string;
}

/** 會簽對象節點 */
export interface CounterSignNode extends User {
    /** 會簽類型 */
    fd_type: string;
    /** 會簽天數 */
    fd_day: number;
    /** 會簽結束否 */
    fd_isWriteBack?: boolean;
    /** 會簽完成時間 */
    fd_doneTime?: string;
}

/** 會簽資訊 */
export interface CounterSign {
    /** 建議會簽清單(部門) */
    fd_suggest: CounterSignNode[];
    /** 是否已使用建議會簽(部門) */
    fd_useSuggest: boolean;
    /** 是否已取消使用建議會簽(部門) */
    fd_cancelSuggest: boolean;
    /** 建議會簽清單(指導師父) */
    fd_suggestMaster: CounterSignNode[];
    /** 是否已使用建議會簽(指導師父) */
    fd_useSuggestMaster: boolean;
    /** 是否已取消使用建議會簽(指導師父) */
    fd_cancelSuggestMaster: boolean;
    /** 前次(當前)會簽清單 */
    fd_list: CounterSignNode[];
    /** 會簽起始時間 */
    fd_startTime: string;
    /** 結束否, default: false(非會簽中) */
    fd_isDone: boolean;
}

/** 核後通知單位名單 */
export interface ApprovedSend extends User {
    /** 設定人員 */
    fd_add: {
        fd_LDAP: string;
        fd_name: string;
        fd_time: string;
    };
    /** 通知時間 */
    fd_sendTime: string;
    /** 已通知註記 */
    fd_isApprovedMangerSend: boolean;
}

/** 流程引擎 */
export interface FlowEngine {
    fd_flowType?: string;
    /** 簽核計數 */
    fd_control: number;
    /** 收文流程 */
    fd_inFlow: FlowNode[];
    /** 簽核流程 */
    fd_flow: FlowNode[];
    /** 核後簽核計數 */
    fd_outControl: number;
    /** 核後簽核清單 */
    fd_outFlow: FlowNode[];
    /** 簽核設定 */
    fd_flowSetting: FlowSetting | null;
    /** 會簽相關資訊 */
    fd_counterSign: CounterSign;
    /** 目前簽核者 */
    fd_docAuthor: FlowNode;
    /** 代理人 */
    fd_docSubAuthor: FlowNode | null;
    /** 前次簽核時間 */
    fd_fnTime: string;
    /** 簽核期限 */
    fd_lmTime: string;
    /** 表單狀態 */
    fd_formStatus: string;
    /** 核可時間 */
    fd_approvedTime: string;
    /** 結案否 */
    fd_isDone: boolean;
    /** 結案時間 */
    fd_doneTime: string;
    /** 簽核紀錄 */
    fd_signedLogs: SignedLog[];
    /** 讀者(個人) */
    fd_readers: string[];
    /** 讀者(部門) */
    fd_readDeptNos: string[];
    /** 讀者(角色) */
    fd_roles: string[];
    /** 會簽主管指定通知名單 */
    fd_counterSignSend: ApprovedSend[];
    /** 核後通知單位清單 */
    fd_approvedSendDepts: ApprovedSend[];
    /** 核後通知指導師父清單 */
    fd_approvedSendToMasters: ApprovedSend[];
    /** 已發送核後通知註記 */
    fd_isEndApprovedMangerSend: boolean;

    /** 原流程設定(董事長辦公室轉成林副總時紀錄用) */
    fd_oldFlowSetting?: FlowSetting;
    /** 原向上流程(董事長辦公室轉成林副總時紀錄用) */
    fd_oldUpFlow?: FlowNode[];
}

/** 附件檔資訊 */
export interface Attachment {
    /** 檔案唯一碼 */
    fd_FID: string;
    /** 上傳時間 */
    fd_createTime: string;
    /** 檔案類型 */
    fd_mime: string;
    /** 原始檔案名稱 */
    fd_fileName: string;
    /** 附件檔儲存位置 */
    fd_filePath: string;
    /** 檔案大小(KB) */
    fd_size: string;
    /** 上傳者 */
    fd_author: {
        fd_LDAP: string;
        fd_name: string;
    };
}

/** 附件連結 */
export interface Link {
    /** 唯一碼 */
    fd_LID: string;
    /** 說明文字 */
    fd_text: string;
    /** 連結網址 */
    fd_url: string;
}

/** 基礎表單格式 */
export interface DefaultForm {
    /** couchdb _id, 預設為 fd_secNo */
    _id?: string;
    /** couchdb _rev, 由 couchdb 自動產生 */
    _rev?: string;
    /** 表單名稱(英文) */
    form: string;
    /** 表單名稱(中文) */
    formName: string;
    /** 表單序號 */
    fd_secNo: string;
    /** 表單建立時間 */
    fd_createTime: string;
    /** 表單建立者 */
    fd_createAuthor: {
        fd_hmDocID: string;
        fd_LDAP: string;
        fd_name: string;
        fd_wrkDeptNo: string;
        fd_wrkDeptFullName: string;
        fd_wrkTitleName: string;
    };
    /** 主旨 */
    fd_subject: string;
    /** 附件 */
    fd_attach: Attachment[];
    /** 流程引擎 */
    fd_flowEngine: FlowEngine;
    created?: History;
    history?: History[];
}

/** 基礎表單格式(會簽單) */
export interface DefaultCounterSignForm {
    /** 表單名稱(英文) */
    form: string;
    /** 表單名稱(中文) */
    formName: string;
    /** 表單序號 */
    fd_secNo: string;
    /** 表單建立時間 */
    fd_createTime: string;
    /** 表單建立者 */
    fd_createAuthor: {
        fd_hmDocID: string;
        fd_LDAP: string;
        fd_name: string;
        fd_wrkDeptNo: string;
        fd_wrkDeptFullName: string;
        fd_wrkTitleName: string;
    };
    /** 原公文表單資訊 */
    fd_fromDoc: {
        /** 原公文表單名稱(英文) */
        form: string;
        /** 原公文表單名稱(中文) */
        formName: string;
        /** 原公文表單序號 */
        fd_secNo: string;
        /** 原公文流程引擎 */
        fd_flowEngine: {
            fd_control: number;
            fd_flow: FlowNode[];
            fd_flowSetting: FlowSetting | null;
            fd_counterSign: { fd_list: CounterSignNode[] };
            fd_signedLogs: SignedLog[];
        };
    };
    /** 啟動會簽人 */
    fd_toSigner: {
        fd_hmDocID: string;
        fd_LDAP: string;
        fd_name: string;
        fd_wrkAffiliateUniNo: string;
        fd_wrkDutyName: string;
        fd_wrkDeptNo: string;
        fd_wrkDeptFullName: string;
        fd_wrkTitleName: string;
        fd_wrkList: DeptNode[];
        fd_day: number;
        fd_type: string;
    };
    /** 被會簽人 */
    fd_trigger: {
        fd_hmDocID: string;
        fd_LDAP: string;
        fd_name: string;
        fd_wrkDeptFullName: string;
        fd_wrkDeptNo: string;
        fd_wrkAffiliateUniNo: string;
        fd_wrkTitleName: string;
        fd_wrkDutyName: string;
        fd_wrkList: DeptNode[];
    };
    /** 主旨 */
    fd_subject: string;
    /** 附件 */
    fd_attach: Attachment[];
    /** 流程引擎 */
    fd_flowEngine: FlowEngine;
    created?: History;
    history?: History[];
}

/** 編修紀錄 */
interface EditLog {
    fd_LDAP: string;
    fd_name: string;
    fd_time: string;
}

/** 收文資訊 */
export interface InMethod {
    /** 速別 */
    fd_speed: string;
    /** 機密級別 */
    fd_security: string;
    /** 來文日期 */
    fd_date: string;
    /** 來文文號 */
    fd_no: string;
    /** 收文文號(提供總務手 key) */
    fd_receiveNo: string;
    /** 來文機關 */
    fd_org: string;
    /** 公文類別 */
    fd_type: string;
    /** 來文主旨 */
    fd_subject: string;
    /** 收文方式 */
    fd_media: string;
    /** 來文附件 */
    fd_attach: Attachment[];
    /** 原文及附件連結 */
    fd_links: Link[];
}

/** 發文資訊 */
export interface MsMethod {
    /** 擬稿方式: 簽搞並陳 or 已稿代簽 */
    fd_method: string;
    /** 承辦人電話與分機 */
    fd_tel: string;
    /** 發文主旨 */
    fd_subject: string;
    fd_subjectEditInfo?: EditLog;
    /** 發文說明 */
    fd_expound: string;
    fd_expoundEditInfo?: EditLog;
    /** 發文辦法 */
    fd_schemes: string;
    fd_schemesEditInfo?: EditLog;
    /** 保存年限 */
    fd_stgLife: string;
    /** 速別 */
    fd_speed: string;
    /** 機密等級 */
    fd_security: string;
    /** 解密條件 */
    fd_securityOffCon: string;
    /** 解密日期 */
    fd_securityOffDay: string;
    /** 公文類別: 函、人事命令、開會通知、獎懲公告 */
    fd_type: string;
    /** 受文者 */
    fd_receiver: string[];
    /** 副本受文者 */
    fd_copyTo: string[];
    /** 發文附件 */
    fd_msAttach: Attachment[];
    /** 發文日期 */
    fd_outDate?: string;
    /** 發文文號 */
    fd_outNo?: string;
    /** 發文機關(附屬機構用) */
    fd_outDeptFullName?: string;
    /** 發文結案狀態, "1":發文結案 "2":不發文結案 */
    fd_closeStatus?: string;
    /** 不發文結案原因 */
    fd_notOutReason?: string;
}

/** 創簽單 */
export interface NTForm extends DefaultForm {
    fd_subjectEditInfo?: EditLog;
    /** 說明 */
    fd_expound: string;
    fd_expoundEditInfo?: EditLog;
    /** 辦法 */
    fd_schemes: string;
    fd_schemesEditInfo?: EditLog;
    /** 附件連結 */
    fd_links: Link[];
    /** 會簽附件 */
    fd_processAttach: Attachment[];
    /** 董事長紙本附件 */
    fd_upPrintedAttach: Attachment[];
    /** 是否傳遞實體文 */
    fd_isHvDocument: boolean;
    /** 是否已簽收實體文 */
    fd_hvDocCheck: boolean;
    /** 主旨等欄位是否被編修過 */
    fd_isEdit?: boolean;
    /** 是否已列印上呈 */
    fd_isUpPrinted?: boolean;
    /** 是否已發送核後通知所有人 */
    fd_isApprovedSend?: boolean;
}

/** 創稿單 */
export interface MSForm extends DefaultForm {
    /** 發文資訊 */
    fd_msMethod: MsMethod;
    /** 便簽 */
    fd_schemes: string;
    fd_schemesEditInfo?: EditLog;
    /** 附件連結 */
    fd_links: Link[];
    /** 會簽附件 */
    fd_processAttach: Attachment[];
    /** 董事長紙本附件 */
    fd_upPrintedAttach: Attachment[];
    /** 是否傳遞實體文 */
    fd_isHvDocument: boolean;
    /** 是否已簽收實體文 */
    fd_hvDocCheck: boolean;
    /** 主旨等欄位是否被編修過 */
    fd_isEdit?: boolean;
    /** 發文電子附簽 */
    fd_outAttach: Attachment[];
    /** 是否已列印上呈 */
    fd_isUpPrinted?: boolean;
    /** 是否已發送核後通知所有人 */
    fd_isApprovedSend?: boolean;
}

/** 外來文 */
export interface INForm extends DefaultForm {
    /** 收文資訊 */
    fd_inMethod: InMethod;
    /** 外來文指派部門編碼 */
    fd_assignDeptNo: string;
    /** 外來文指派部門名稱 */
    fd_assignDeptFullName: string;
    /** 外來文指派承辦人時間 */
    fd_assignTime: string;
    // fd_assignTo?: AssignInfo;
    /** 保存年限(來文) */
    fd_stgLife: string;
    /** 來文處理方式 */
    fd_processType: string;
    /** 便簽 */
    fd_schemes: string;
    fd_schemesEditInfo?: EditLog;
    /** 發文資訊 */
    fd_msMethod?: MsMethod;
    /** 附件連結 */
    fd_links: Link[];
    /** 會簽附件 */
    fd_processAttach: Attachment[];
    /** 原會簽附件 */
    fd_oldProcessAttach: Attachment[];
    /** 董事長紙本附件 */
    fd_upPrintedAttach: Attachment[];
    /** 是否傳遞實體文 */
    fd_isHvDocument: boolean;
    /** 是否已簽收實體文 */
    fd_hvDocCheck: boolean;
    /** 主旨等欄位是否被編修過 */
    fd_isEdit?: boolean;
    /** 發文電子附簽 */
    fd_outAttach?: Attachment[];
    /** 是否已列印上呈 */
    fd_isUpPrinted?: boolean;
    /** 是否已發送核後通知所有人 */
    fd_isApprovedSend?: boolean;
}

/** 會簽單 */
export interface Form extends DefaultCounterSignForm {
    /** 收文資訊 */
    fd_inMethod?: InMethod;
    /** 是否傳遞實體文 */
    fd_isHvDocument: boolean;
    /** 是否已簽收實體文 */
    fd_hvDocCheck: boolean;
    /** 保存年限(來文) */
    fd_stgLife?: string;
    /** 來文處理方式 */
    fd_processType?: string;
    /** 說明 */
    fd_expound?: string;
    /** 辦法 or 便簽 */
    fd_schemes: string;
    /** 發文資訊 */
    fd_msMethod?: MsMethod;
    fd_links: Link[];
    /** 原會簽附件 */
    fd_oldProcessAttach: Attachment[];
    /** 本次新添加的會簽附件 */
    fd_processAttach: Attachment[];
}
