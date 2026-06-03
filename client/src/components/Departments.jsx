import { useEffect, useRef, useState,useMemo} from "react";
import StyledTable from "./StyledTable";
import RowField from "./RowField";
import {Box, Alert} from "@mui/material";
import  { useDepartments }  from '../custom_hooks/useDepartments';
import { getDepartmentColumns } from "./departmentColumns";
import CustomButton from "./CustomButton";


const Departments=() =>
{
  const { loadingDepartments, rows,fetchDepartments
          ,expandedRows,handleToggleEmployees,
          tableRef, paginationModel,isMobile,rowsWithDetails,
          departmentId,handleNewDepartment,handleRemoveClick,
          feedbackMsg, errorMsg} = useDepartments();


const columns = useMemo( ()=>{
  return getDepartmentColumns({isMobile, expandedRows,handleToggleEmployees});
},[isMobile,expandedRows,handleToggleEmployees]);

  const columnVisibilityModel = isMobile
  ? {
      name: false,
      manager_name: false,
    }
  : undefined;

  
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({items: []});

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
           flexDirection: "column",
          alignItems: "center",
        }}
    >
      {feedbackMsg && <Alert severity="success">{feedbackMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
       <StyledTable  key={isMobile ? "mobile" : "desktop"} zebraRows={true}  rows={rowsWithDetails} columns={columns} 
       paginationModel={paginationModel} pageSizes={[5,10,20,30]} 
       title="Departments" loading={loadingDepartments} 
       columnVisibilityModel={columnVisibilityModel} 
       showToolbar={isMobile} enableToolbarSorting={isMobile}
         sortModel={sortModel} setSortModel={setSortModel}
          filterModel={filterModel} setFilterModel={setFilterModel}
       includeCheckboxes={true} ref={tableRef} />   
        <div style={{ display:"flex" ,flexDirection:"row", justifyContent:"center"}}>
            <CustomButton clickHandler={ () => { handleNewDepartment(); }} bgColor="#1974D2"  textColor="white" label="Add New Department"/>
            <CustomButton clickHandler={handleRemoveClick} bgColor="#CB6D51" textColor="white" label="Remove Departments"/>
      </div>

       
    </Box>
  )
}

export default Departments