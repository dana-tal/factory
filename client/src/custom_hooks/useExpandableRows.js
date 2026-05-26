import { useState } from "react";

export const useExpandableRows = () => {

    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (rowId) => 
    {
        setExpandedRows((prev) =>
            prev.includes(rowId)
                ? prev.filter((id) => id !== rowId)
                : [...prev, rowId]
        );
    };

    const isExpanded = (rowId) => 
    {
        return expandedRows.includes(rowId);
    };

    return {expandedRows,toggleRow,isExpanded};
};