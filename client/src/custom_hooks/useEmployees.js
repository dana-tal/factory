import { useState,useRef} from "react";
import { requestAllEmployees,requestEmployeeAdd ,requestEmployeeUpdate, requestRemoveEmployees} from "../utils/employeeRequest";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";



export const useEmployees = ()=>
{
    const [loadingEmployees, setLoadingEmployees] = useState(false); 
    const [rows, setRows] = useState([]);      // will hold a row for each employee 
    const [expandedRows, setExpandedRows] = useState([]); // will hold employee ids of rows that show the employee's shifts 
    const [employeeId, setEmployeeId] = useState("");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const tableRef = useRef();
    const paginationModel = { page: 0, pageSize: 10 };
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const rowsWithDetails = []; // will hold all the rows: regular employee rows and shifts content rows 

    const navigate = useNavigate();

    // build the data structure rowsWithDetails 
    rows.forEach((row) => 
    {
        rowsWithDetails.push(row);
        if (expandedRows.includes(row.id)) {

            rowsWithDetails.push({
                id: `detail-${row.id}`,
                isDetailRow: true,
                parentId: row.id,
                shifts: row.shifts
            });
        }
    });

    const fetchEmployees = async ()=>
    {
          setLoadingEmployees(true);
          const allEmployees =  await requestAllEmployees();
          console.log(allEmployees);
          setRows(allEmployees);
          setLoadingEmployees(false);         
    }

    // for showing and hiding shifts content 
    const handleToggleShifts = (rowId) => 
    {
            setExpandedRows((prev) =>
                prev.includes(rowId)
                    ? prev.filter((id) => id !== rowId)
                    : [...prev, rowId]
            );
    };

      const handleNewEmployee = ()=>{
        setEmployeeId(""); 
        navigate("/employees/add");
    }

    const showFeedback =  (msg)=>{
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
            showErrorMsg("No employees were selected for removal, please select some.");
            return;
        }
        try
        {
            const ids = Array.from(selectedIDs.ids);
            const res = await requestRemoveEmployees(ids);
             setRows( (prevRows)=> {  
                       let temp = [ ...prevRows];
                       const updatedRows  =  temp.filter( emp => { return !ids.includes(emp.id) } )
                       return updatedRows;
             })
             showFeedback("Employee(s) removed successfully");    
        }
        catch(err)
        {
            console.log("Status:", err.response?.status);
            console.log("Data:", err.response?.data);
            console.log("Message:", err.response?.data?.message || err.message);
        }
    };

     const handleEmployeeAdd = async (emp_Obj, setError)=>{
   
        try
        {
            const employee = await requestEmployeeAdd(emp_Obj);
            setRows( (prevRows)=>{  return [ ...prevRows, employee] } );               
            return true;          
        }
        catch(err)
        {
            console.log("Status:", err.response?.status);
            console.log("Data:", err.response?.data);
            console.log("Message:", err.response?.data?.message || err.message);

             setError("root", {
                    type: "manual",
                    message: err.response?.data?.message || err.message || "Adding employee failed"
                });
            return false;
        }
        
    }

    const handleEmployeeUpdate = async (emp_Obj, setError) =>
    {
        try
        {
            const updatedEmployee = await requestEmployeeUpdate(emp_Obj);
                setRows( (prevRows)=>{  
                    let temp = [...prevRows]; 
                    let updated = temp.map( (emp)=>{ if (emp.id=== updatedEmployee.id){ return updatedEmployee } else { return emp }  } );
                    return updated;
                });
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

      return { loadingEmployees,rows,fetchEmployees,expandedRows,
            handleToggleShifts, tableRef, paginationModel,isMobile,
            rowsWithDetails, employeeId,handleNewEmployee,handleRemoveClick,
            feedbackMsg,errorMsg ,handleEmployeeAdd, handleEmployeeUpdate};

}