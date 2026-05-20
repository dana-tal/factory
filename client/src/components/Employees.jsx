import { useEffect, useRef, useState} from "react";
import StyledTable from "./StyledTable";
import RowField from "./RowField";
import {Box, Alert} from "@mui/material";
import  { useEmployees }  from '../custom_hooks/useEmployees';
import { getEmployeeColumns } from "./employeeColumns";
import CustomButton from "./CustomButton";

function Employees() {

  const { loadingEmployees, rows,fetchEmployees
            ,expandedRows,handleToggleShifts,
            tableRef, paginationModel,isMobile,rowsWithDetails,
            employeeId,handleNewEmployee,handleRemoveClick,
            feedbackMsg, errorMsg} = useEmployees();
  
    const columns = getEmployeeColumns({isMobile, expandedRows,handleToggleShifts});

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
       <StyledTable rows={rowsWithDetails} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Employees" loading={loadingEmployees} includeCheckboxes={true} ref={tableRef} />   
        <div style={{ display:"flex" ,flexDirection:"row", justifyContent:"center"}}>
            <CustomButton clickHandler={ () => { handleNewEmployee(); }} bgColor="#1974D2"  textColor="white" label="Add New Employee"/>
            <CustomButton clickHandler={handleRemoveClick} bgColor="#CB6D51" textColor="white" label="Remove Employees"/>
      </div>

       
    </Box>
  )
}

export default Employees