import React, { useEffect, useState } from "react";
import "./index.css";

interface TableData {
    fd_createTime: string;
    fd_doneTime: string;
    fd_formStatus: string;
    fd_name: string;
    fd_secNo: string;
    fd_subject: string;
    fd_wrkDeptFullName: string;
    key: string;
}

interface TableProps {
    data: TableData[];
}

const Table: React.FC<TableProps> = ({ data: fetchedData }) => {
    const [sortedData, setSortedData] = useState<TableData[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof TableData;
        direction: "ascending" | "descending";
    } | null>({
        key: "key",
        direction: "ascending",
    });

    useEffect(() => {
        if (fetchedData) {
            setSortedData(fetchedData);
        }
    }, [fetchedData]);

    const requestSort = (key: keyof TableData) => {
        let direction: "ascending" | "descending" = "ascending";

        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "ascending"
        ) {
            direction = "descending";
        }
        const sortedArray = [...sortedData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === "ascending" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
        setSortedData(sortedArray);
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        console.log(sortConfig);
    }, [sortConfig]);

    return (
        <table
            className="table-scope"
            style={{
                border: "1px solid black",
                width: "100%",
                borderCollapse: "collapse",
            }}
        >
            <thead>
                <tr>
                    <th onClick={() => requestSort("key")}>ID</th>
                    <th onClick={() => requestSort("fd_name")}>Name</th>
                    <th onClick={() => requestSort("fd_subject")}>Subject</th>
                    <th onClick={() => requestSort("fd_wrkDeptFullName")}>
                        Work Department
                    </th>
                    <th onClick={() => requestSort("fd_secNo")}>fd_secNo</th>
                    <th onClick={() => requestSort("fd_createTime")}>
                        Create Time
                    </th>
                    <th onClick={() => requestSort("fd_doneTime")}>
                        Done Time
                    </th>
                    <th onClick={() => requestSort("fd_formStatus")}>
                        Form Status
                    </th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.length > 0 ? (
                    sortedData.map((row, index) => (
                        <tr
                            key={row.key}
                            className="table-row"
                            onClick={() => {
                                console.log(row);
                            }}
                        >
                            <td>{index + 1}</td>
                            <td>{row.fd_name}</td>
                            <td>{row.fd_subject}</td>
                            <td>{row.fd_wrkDeptFullName}</td>
                            <td>{row.fd_secNo}</td>
                            <td>{row.fd_createTime}</td>
                            <td>{row.fd_doneTime}</td>
                            <td>{row.fd_formStatus}</td>
                            <td>
                                <button
                                    onClick={(row) => {
                                        sortedData.splice(index, 1);
                                        setSortedData([...sortedData]);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={9}>No data</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
