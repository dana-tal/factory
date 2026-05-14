import { useState,useRef} from "react";
import { requestAllDepartments } from "../utils/departmentRequest";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


export const useEditableDepartment = () => {

    const [loadingDepartments, setLoadingDepartments] = useState(false); 
    const [rows, setRows] = useState([]);      // will hold a row for each department 
    const [expandedRows, setExpandedRows] = useState([]); // will hold department ids of rows that show the department employees 
    
    const tableRef = useRef();
    const paginationModel = { page: 0, pageSize: 10 };
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    
    const rowsWithDetails = []; // will hold all the rows: regular department rows and employees content rows 

    rows.forEach((row) => 
    {
        rowsWithDetails.push(row);
        if (expandedRows.includes(row.id)) {

            rowsWithDetails.push({
                id: `detail-${row.id}`,
                isDetailRow: true,
                parentId: row.id,
                employees: row.employees
            });
        }
    });

    const fetchDepartments = async ()=>
    {
          setLoadingDepartments(true);
          const allDepartments =  await requestAllDepartments();
          setRows(allDepartments);
          setLoadingDepartments(false);         
    }

    // for showing and hiding employees content 
    const handleToggleEmployees = (rowId) => 
    {
            setExpandedRows((prev) =>
                prev.includes(rowId)
                    ? prev.filter((id) => id !== rowId)
                    : [...prev, rowId]
            );
    };


    return { loadingDepartments,rows,fetchDepartments,expandedRows,handleToggleEmployees, tableRef, paginationModel,isMobile,rowsWithDetails};
}