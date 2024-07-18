import React, { useState, useEffect } from "react";
interface TableAction {
    type: string;
    timestamp: number;
    details: {
        row: number;
        column: number;
    };
}

const TableActionRecorder: React.FC = () => {
    const [actions, setActions] = useState<TableAction[]>([]);

    useEffect(() => {
        const storedActions = localStorage.getItem("tableActions");
        if (storedActions) {
            setActions(JSON.parse(storedActions));
        }
    }, []);

    const recordAction = (type: string, row: number, column: number) => {
        const newAction: TableAction = {
            type,
            timestamp: Date.now(),
            details: { row, column },
        };
        const updatedActions = [...actions, newAction];
        setActions(updatedActions);
        localStorage.setItem("tableActions", JSON.stringify(updatedActions));
    };

    const handleCellClick = (row: number, column: number) => {
        recordAction("cellClick", row, column);
    };

    return (
        <div>
            <h1>Click a cell to record the action</h1>
            <table>
                <tbody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: 5 }).map((_, colIndex) => (
                                <td
                                    key={colIndex}
                                    onClick={() =>
                                        handleCellClick(rowIndex, colIndex)
                                    }
                                    style={{
                                        border: "1px solid black",
                                        padding: "10px",
                                    }}
                                >
                                    Row {rowIndex + 1}, Col {colIndex + 1}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ul>
                {actions.map(
                    (action, index, arr) => (
                        console.log("Element:", action), // 當前元素
                        console.log("index", index),
                        console.log("arr:", arr),
                        (
                            <li key={index}>
                                {action.type} at
                                {new Date(action.timestamp).toLocaleString()}
                                (Row: {action.details.row + 1}, Column:{" "}
                                {action.details.column + 1})
                            </li>
                        )
                    )
                )}
            </ul>
        </div>
    );
};

export default TableActionRecorder;
