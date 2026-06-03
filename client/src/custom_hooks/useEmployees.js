import { useState,useRef} from "react";
import { requestAllEmployees,requestEmployeeAdd ,requestEmployeeUpdate, requestRemoveEmployees} from "../utils/employeeRequest";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useEntities } from "./useEntities";

import { useExpandableRows } from "./useExpandableRows";
import { buildRowsWithDetails } from "../utils/buildRowsWithDetails";

const normalizeEmployee = (emp) => {
  return {
    ...emp,
    emp_name: `${emp.firstName} ${emp.lastName}`,
    department_name: emp.department.name ,
  };
};

export const useEmployees = ()=>
{
    const [loadingEmployees, setLoadingEmployees] = useState(false); 
    const [rows, setRows] = useState([]);      // will hold a row for each employee 
    const [employeeId, setEmployeeId] = useState("");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const tableRef = useRef();
    const paginationModel = { page: 0, pageSize: 10 };
  //  const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:480px)');
 
    const navigate = useNavigate();

    const { expandedRows,toggleRow: handleToggleShifts,isExpanded} = useExpandableRows();
    
     const { handleEntityAdd,handleEntityUpdate, handleRemoveMany } = useEntities({setRows,setFeedbackMsg,requestAddCallback:requestEmployeeAdd,
                                              requestRemoveCallback:requestRemoveEmployees ,requestUpdateCallback:requestEmployeeUpdate,
                                              entity_name:"employee" });

    const rowsWithDetails = buildRowsWithDetails({
    rows,
    expandedRows,
    buildDetailRow: (row) => ({
        id: `detail-${row.id}`,
        isDetailRow: true,
        parentId: row.id,
        shifts: row.shifts,
        emp_name: row.emp_name,
        department_name: row.department_name,
        department: row.department
    })
});

    const fetchEmployees = async ()=>
    {
          setLoadingEmployees(true);
          const allEmployees =  await requestAllEmployees();
         // setRows(allEmployees);
         setRows(allEmployees.map(normalizeEmployee));
          setLoadingEmployees(false);         
    }

      const handleNewEmployee = ()=>{
        setEmployeeId(""); 
        navigate("/employees/add");
    }


    const showErrorMsg =  (msg)=>{
        setErrorMsg(msg);
         setTimeout(() => {
                    setErrorMsg("");
                    }, 4000);
     }

    const handleRemoveClick = async () => {

        if (!tableRef.current) 
        {
            console.log("no tableRef.current");
            return;
        }
        const selectedIDs = tableRef.current.getSelectedIds(); 
      
        if (!selectedIDs ||  selectedIDs.length===0 || !selectedIDs.ids )
        {
            showErrorMsg("No employees were selected for removal, please select some.");
            return;
        }
         const ids = Array.from(selectedIDs.ids);
        return handleRemoveMany(ids);           
    };

     const handleEmployeeAdd = async (emp_obj, setError)=>
    {
         return handleEntityAdd(emp_obj,setError);   
    }

    const handleEmployeeUpdate = async (emp_obj, setError) =>
    {
        return handleEntityUpdate(emp_obj,setError );       
    }

      return { loadingEmployees,rows,fetchEmployees,expandedRows,
            handleToggleShifts, tableRef, paginationModel,isMobile,
            rowsWithDetails, employeeId,handleNewEmployee,handleRemoveClick,
            feedbackMsg,errorMsg ,handleEmployeeAdd, handleEmployeeUpdate};

}