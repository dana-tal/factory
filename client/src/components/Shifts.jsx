import StyledTable from "./StyledTable";
import { useEffect, useState} from "react";
import {Box, Alert} from "@mui/material";
import  { useShifts }  from '../custom_hooks/useShifts';
import { getShiftColumns } from "./shiftColumns";
import { useMemo } from "react";
import CustomButton from "./CustomButton";


function Shifts() {

  const { loadingShifts,rows,fetchShifts,paginationModel,isMobile,handleNewShift,
            feedbackMsg,errorMsg ,handleShiftAdd, handleShiftUpdate} = useShifts();

   const columns = useMemo(() => 
  {
    return getShiftColumns({ isMobile });
  }, [isMobile]);
  
  const columnVisibilityModel = isMobile
  ? {
      id: false,
      startDate: false,
      endDate: false,     
    }
  : undefined;
  
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({items: []});

  useEffect(()=>{  
    fetchShifts();
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
       <StyledTable  key={isMobile ? "mobile" : "desktop"} zebraRows={true}  rows={rows} columns={columns} 
       paginationModel={paginationModel} pageSizes={[5,10,20,30]} 
       title="Shits" loading={loadingShifts} 
       columnVisibilityModel={columnVisibilityModel} 
       showToolbar={isMobile} enableToolbarSorting={isMobile}
         sortModel={sortModel} setSortModel={setSortModel}
          filterModel={filterModel} setFilterModel={setFilterModel}
       includeCheckboxes={false}  />   
        <div style={{ display:"flex" ,flexDirection:"row", justifyContent:"center"}}>
            <CustomButton clickHandler={ () => { handleNewShift(); }} bgColor="#1974D2"  textColor="white" label="Add New Shift"/>            
      </div>
     
    </Box>
  )
}

export default Shifts