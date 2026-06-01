import { useEffect, useRef, useState} from "react";
import StyledTable from "./StyledTable";
import {Box, Alert} from "@mui/material";
import  { useEmployees }  from '../custom_hooks/useEmployees';
import { getEmployeeColumns } from "./employeeColumns";
import CustomButton from "./CustomButton";
import { useMemo } from "react";


function Employees() {

  const { loadingEmployees, rows,fetchEmployees
            ,expandedRows,handleToggleShifts,
            tableRef, paginationModel,isMobile,rowsWithDetails,
            employeeId,handleNewEmployee,handleRemoveClick,
            feedbackMsg, errorMsg} = useEmployees();
  
  //  const columns = getEmployeeColumns({isMobile, expandedRows,handleToggleShifts});

  const columns = useMemo(() => {
  return getEmployeeColumns({ isMobile, expandedRows, handleToggleShifts });
}, [isMobile, expandedRows, handleToggleShifts]);

    const columnVisibilityModel = isMobile
  ? {
      emp_name: false,
      department_name: false,
    }
  : undefined;

  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({items: []});

  useEffect(()=>{  
    fetchEmployees();
  },[] );


  return (
     <Box
       width={{ xs: "90%", sm: "70%", md: "70%", lg: "70%" }}
      mx="auto"
      mt={5}
      p={3}
     sx={{
          display: "flex",
           flexDirection: "column",
          alignItems: "center",
        }}
    >
      {feedbackMsg && <Alert severity="success">{feedbackMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
       <StyledTable key={isMobile ? "mobile" : "desktop"} zebraRows={true} rows={rowsWithDetails} columns={columns} 
       paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Employees" 
       loading={loadingEmployees}   
       columnVisibilityModel={columnVisibilityModel} includeCheckboxes={true}
        showToolbar={isMobile} enableToolbarSorting={isMobile}
         sortModel={sortModel} setSortModel={setSortModel}
          filterModel={filterModel} setFilterModel={setFilterModel}
        ref={tableRef} />   
        <div style={{ display:"flex" ,flexDirection:"row", justifyContent:"center"}}>
            <CustomButton clickHandler={ () => { handleNewEmployee(); }} bgColor="#1974D2"  textColor="white" label="Add New Employee"/>
            <CustomButton clickHandler={handleRemoveClick} bgColor="#CB6D51" textColor="white" label="Remove Employees"/>
      </div>

       
    </Box>
  )
}

export default Employees