import StyledTable from "./StyledTable";
import { useEffect, useState} from "react";
import {Box, Alert} from "@mui/material";
import  { useUsers }  from '../custom_hooks/useUsers';
import { getUserColumns } from "./userColumns";
import { useMemo } from "react";


function Users() {

  const { loadingUsers, fetchUsers, paginationModel,isMobile,rows} = useUsers();

  const columns = useMemo(() => 
  {
    return getUserColumns({ isMobile });
  }, [isMobile]);
  
  const columnVisibilityModel = isMobile
  ? {
      fullName: false,
      maxActions: false,
      username: false,
      email:false
    }
  : undefined;

  
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({items: []});

  useEffect(()=>{  
    fetchUsers();
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
      <StyledTable key={isMobile ? "mobile" : "desktop"} zebraRows={true} rows={rows} columns={columns} 
       paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Users" 
       loading={loadingUsers}   
       columnVisibilityModel={columnVisibilityModel} includeCheckboxes={false}
        showToolbar={isMobile} enableToolbarSorting={isMobile}
         sortModel={sortModel} setSortModel={setSortModel}
          filterModel={filterModel} setFilterModel={setFilterModel}
        />
    </Box>
  )
}

export default Users