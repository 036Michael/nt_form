interface DataType extends DataType_CN {
    fd_createTime: string;
    fd_doneTime: string;
    fd_formStatus: string;
    fd_name: string;
    fd_secNo: string;
    fd_subject: string;
    fd_wrkDeptFullName: string;
    key: string;
}

interface DataType_CN {
    起始日期: string;
    承辦人: string;
    承辦單位: string;
    主旨: string;
    表單狀態: string;
    表單序號: string;
    結束日期: string;
}
