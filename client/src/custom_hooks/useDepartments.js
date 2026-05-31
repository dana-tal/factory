import { useState,useRef} from "react";
import { requestAllDepartments,requestDepartmentAdd ,requestDepartmentUpdate, requestRemoveDepartments} from "../utils/departmentRequest";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useEntities } from "./useEntities";
import { buildRowsWithDetails } from "../utils/buildRowsWithDetails";


const normalizeDepartment = (dept) => {
    return {
        ...dept,
        manager_name:  `${dept.manager.firstName} ${dept.manager.lastName}`,        
    }   
}   

export const useDepartments = () => {

    const [loadingDepartments, setLoadingDepartments] = useState(false); 
    const [rows, setRows] = useState([]);      // will hold a row for each department 
    const [expandedRows, setExpandedRows] = useState([]); // will hold department ids of rows that show the department employees 
    const [departmentId, setDepartmentId] = useState("");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const tableRef = useRef();
    const paginationModel = { page: 0, pageSize: 10 };
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

     const { handleEntityAdd,handleEntityUpdate, handleRemoveMany } = useEntities({setRows,setFeedbackMsg,requestAddCallback:requestDepartmentAdd,
                                              requestRemoveCallback:requestRemoveDepartments ,requestUpdateCallback:requestDepartmentUpdate,
                                              entity_name:"department" });



 // will hold all the rows: regular department rows and employees content rows 
const rowsWithDetails = buildRowsWithDetails({
    rows,
    expandedRows,
    buildDetailRow: (row) => ({
        id: `detail-${row.id}`,
        isDetailRow: true,
        parentId: row.id,
        employees: row.employees,
        name: row.name,
        manager_name: row.manager_name
    })
});


    const fetchDepartments = async ()=>
    {
          setLoadingDepartments(true);
          const allDepartments =  await requestAllDepartments();
          setRows(allDepartments.map(normalizeDepartment));       
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

    const handleNewDepartment = ()=>{
        setDepartmentId(""); 
        navigate("/departments/add");
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
            showErrorMsg("No departments were selected for removal, please select some.");
            return;
        }
        const ids = Array.from(selectedIDs.ids);
        return handleRemoveMany(ids);       
    };

  
   const handleDepartmentAdd = (dept_obj,setError) => 
   {
        return handleEntityAdd(dept_obj,setError);
    };


  const handleDepartmentUpdate = async (dept_Obj, setError) =>{
    return handleEntityUpdate(dept_Obj,setError );
  }

    return { loadingDepartments,rows,fetchDepartments,expandedRows,
            handleToggleEmployees, tableRef, paginationModel,isMobile,
            rowsWithDetails, departmentId,handleNewDepartment,handleRemoveClick,
            feedbackMsg,errorMsg ,handleDepartmentAdd, handleDepartmentUpdate};
}