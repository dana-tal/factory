import { useEffect, useRef, useState} from "react";
import StyledTable from "./StyledTable";
import RowField from "./RowField";
import {Box, Alert} from "@mui/material";
import  { useEditableDepartment}  from '../custom_hooks/useEditableDepartment';
import { getDepartmentColumns } from "./departmentColumns";

const Departments=() =>
{
  const { loadingDepartments, rows,fetchDepartments
          ,expandedRows,handleToggleEmployees,
          tableRef, paginationModel,isMobile,rowsWithDetails} = useEditableDepartment();

  const columns = getDepartmentColumns({isMobile, expandedRows,handleToggleEmployees});

 // console.log(columns.map(c => c.field));

  useEffect(()=>{  
    fetchDepartments();
  },[] );


  return (
   <Box
       width={{ xs: "90%", sm: "70%", md: "70%", lg: "70%" }}
      mx="auto"
      mt={5}
      p={3}
     sx={{
          display: "flex",
          justifyContent: "center",
        }}
    >
       <StyledTable rows={rowsWithDetails} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Departments" loading={loadingDepartments} includeCheckboxes={true} ref={tableRef} />   
    </Box>
  )
}

export default Departments