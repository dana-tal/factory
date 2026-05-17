import { useEffect, useRef, useState} from "react";
import StyledTable from "./StyledTable";
import RowField from "./RowField";
import {Box, Alert} from "@mui/material";
import  { useEditableDepartment}  from '../custom_hooks/useEditableDepartment';
import { getDepartmentColumns } from "./departmentColumns";
import CustomButton from "./CustomButton";
import LightBox from "./LightBox";
import DepartmentForm from "./DepartmentForm";

const Departments=() =>
{
  const { loadingDepartments, rows,fetchDepartments
          ,expandedRows,handleToggleEmployees,
          tableRef, paginationModel,isMobile,rowsWithDetails,
          isLightboxOpen,closeLightbox,departmentId,handleNewDepartment,handleRemoveClick,
          feedbackMsg, errorMsg,handleDepartmentAdd, handleDepartmentUpdate } = useEditableDepartment();

  const columns = getDepartmentColumns({isMobile, expandedRows,handleToggleEmployees});


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
       <StyledTable rows={rowsWithDetails} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Departments" loading={loadingDepartments} includeCheckboxes={true} ref={tableRef} />   
        <div style={{ display:"flex" ,flexDirection:"row", justifyContent:"center"}}>
            <CustomButton clickHandler={ () => { handleNewDepartment(); }} bgColor="#1974D2"  textColor="white" label="Add New Department"/>
            <CustomButton clickHandler={handleRemoveClick} bgColor="#CB6D51" textColor="white" label="Remove Departments"/>
      </div>

        <LightBox  key={departmentId || "new"}  isOpen={isLightboxOpen} onCloseCallback={() => closeLightbox() } backdropColor="rgba(14, 135, 204, 0.3)">
                <DepartmentForm onAddDepartment={handleDepartmentAdd} onUpdateDepartment={handleDepartmentUpdate} departmentId={departmentId}/>
        </LightBox>
    </Box>
  )
}

export default Departments