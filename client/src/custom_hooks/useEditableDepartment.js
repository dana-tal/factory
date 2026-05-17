import { useState,useRef} from "react";
import { requestAllDepartments,requestDepartmentAdd , requestRemoveDepartments} from "../utils/departmentRequest";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";


export const useEditableDepartment = () => {

    const [loadingDepartments, setLoadingDepartments] = useState(false); 
    const [rows, setRows] = useState([]);      // will hold a row for each department 
    const [expandedRows, setExpandedRows] = useState([]); // will hold department ids of rows that show the department employees 
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [departmentId, setDepartmentId] = useState("");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const tableRef = useRef();
    const paginationModel = { page: 0, pageSize: 10 };
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const rowsWithDetails = []; // will hold all the rows: regular department rows and employees content rows 

     const navigate = useNavigate();

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

    const handleNewDepartment = ()=>{
       // setIsLightboxOpen(true);  
        setDepartmentId(""); 
        navigate("/departments/add");
    }

    const closeLightbox = ()=>{
         setIsLightboxOpen(false);
    }

    
     const showFeedback = (msg)=>{
             setFeedbackMsg(msg);
              setTimeout(() => {
                    setFeedbackMsg("");
                    }, 4000);
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
        try
        {
            const ids = Array.from(selectedIDs.ids);
            const res = await requestRemoveDepartments(ids);
             setRows( (prevRows)=> {  
                       let temp = [ ...prevRows];
                       const updatedRows  =  temp.filter( dept => { return !ids.includes(dept.id) } )
                       return updatedRows;
             })
             showFeedback("Department(s) removed successfully");    
        }
        catch(err)
        {
            console.log("Status:", err.response?.status);
            console.log("Data:", err.response?.data);
            console.log("Message:", err.response?.data?.message || err.message);
        }
    };


  const handleDepartmentAdd = async (dept_Obj, setError)=>{
   
        try
        {
            const department = await requestDepartmentAdd(dept_Obj);
            console.log("department", department);
            setRows( (prevRows)=>{  return [ ...prevRows, department] } );
            setIsLightboxOpen(false);
            showFeedback("Department added successfully");   
            return true;          
        }
        catch(err)
        {
            console.log("Status:", err.response?.status);
            console.log("Data:", err.response?.data);
            console.log("Message:", err.response?.data?.message || err.message);

             setError("root", {
                    type: "manual",
                    message: err.response?.data?.message || err.message || "Adding department failed"
                });
            return false;
        }
        
    }

  const handleDepartmentUpdate = (dept_Obj, setError) =>{

   

  }

    return { loadingDepartments,rows,fetchDepartments,expandedRows,
            handleToggleEmployees, tableRef, paginationModel,isMobile,
            rowsWithDetails,isLightboxOpen,closeLightbox, departmentId,handleNewDepartment,handleRemoveClick,
            feedbackMsg,errorMsg ,handleDepartmentAdd, handleDepartmentUpdate};
}