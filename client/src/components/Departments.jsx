import { requestAllDepartments } from "../utils/departmentRequest";
import { useEffect, useRef, useState} from "react";
import StyledTable from "./StyledTable";
import {Box, Alert} from "@mui/material";

const Departments=() =>
{
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [rows, setRows] = useState([]);
  const tableRef = useRef();
  const paginationModel = { page: 0, pageSize: 10 };
  
  const columns = [
    {
       field:'name',
       headerName:'Department Name',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.name}`,
       align:'left',
       type:'string',       
    },       
    {
       field:'manager',
       headerName:'Manager Name',
       flex:1,
       sortable:true,
       valueGetter: (value,row)=>`${row.manager.firstName+' '+row.manager.lastName}`,
       align:'left',
       type:'string',       
    },
    {
        field:'employees',
        headerName:'Employees',
        flex:1,
        sortable:false,
        valueGetter: (value,row)=> 'Employees',
        align:'left',
        type:'string',       
    }
  ];



  useEffect(()=>{
        
    const fetchDepartments = async ()=>
    {
          setLoadingDepartments(true);
          const allDepartments =  await requestAllDepartments();
          setRows(allDepartments);
          setLoadingDepartments(false);
          console.log(allDepartments);
    }
    
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
       <StyledTable rows={rows} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Departments" loading={loadingDepartments} includeCheckboxes={true} ref={tableRef} />   
    </Box>
  )
}

export default Departments