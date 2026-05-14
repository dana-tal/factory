import { requestAllDepartments } from "../utils/departmentRequest";
import { useEffect, useRef, useState} from "react";
import StyledTable from "./StyledTable";
import RowField from "./RowField";
import {Box, Alert} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Departments=() =>
{
  const [loadingDepartments, setLoadingDepartments] = useState(false); 
  const [rows, setRows] = useState([]);      // will hold a row for each department 
  const [expandedRows, setExpandedRows] = useState([]); // will hold department ids of rows that show the department employees 
  const tableRef = useRef();
  const paginationModel = { page: 0, pageSize: 10 };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let columns ;

  if ( isMobile)
  {
       columns = [
          {
              field: 'mobileView',
              headerName: '',
              flex: 1,
              sortable: false,
              filterable: false,
              renderCell: (params) => {
               
                const row = params.row;
               let jsx ;

               if ( row.isDetailRow)
               {
                    jsx =  <Box sx={{ width: '100%' ,display:'flex', justifyContent:'right'}}>
                             <RowField label="" value={ <Box sx={{ p:2 }}>

                          {row.employees.map(emp=>(
                              <Box key={emp.id}>
                                  {emp.firstName} {emp.lastName}
                              </Box>
                          ))}

                      </Box>} />
                    </Box>
               }
               else 
               {
                  const isOpen = expandedRows.includes(row.id);
                   jsx  =  <Box sx={{ width: '100%' }}>
                    <RowField label="Department :" value={row.name } />
                    <RowField label="Manager Name: " value={`${row.manager.firstName} ${row.manager.lastName}`} />
                    <RowField label="Employees: " value={ <Box
                        sx={{
                            cursor:'pointer',
                            color:'#1976d2',
                            fontWeight:'bold'
                        }}
                        onClick={(e)=>{
                            e.stopPropagation();
                            handleToggleEmployees(row.id);
                        }}
                    >
                        {isOpen
                            ? 'Hide Employees'
                            : 'Show Employees'}
                    </Box> } />
                  </Box> 

               } 
 
                return (
                    jsx
                );
              }
            }


       ];

  }
  else 
  {
      columns = [
        {
          field:'name',
          headerName:'Department Name',
          flex:1,
          align:'left',
          renderCell:(params)=>
          {
              if(params.row.isDetailRow) // for details row, return the employees list
              {
                return null;
              }
              return params.row.name;  // for regular row return the department name
            }
        
        },       
        {
          field:'manager',
          headerName:'Manager Name',
          flex:1,
          align:'left',
          renderCell:(params)=>
          {
            if(params.row.isDetailRow)
            {
                return null;
            }
            return `${params.row.manager.firstName} ${params.row.manager.lastName}`;
          }   
        },
        {
            field:'employees',
            headerName:'Employees',
            flex:1,
            sortable:false,
            valueGetter: (value,row)=> 'Employees',
            align:'left',
            renderCell: (params) => /*  for employees row show nothing, for regular department row , show  hide/show link */
            {

                if (params.row.isDetailRow) 
                {
                    return (
                      <Box sx={{ p:2 }}>

                          {params.row.employees.map(emp=>(
                              <Box key={emp.id}>
                                  {emp.firstName} {emp.lastName}
                              </Box>
                          ))}

                      </Box>
                  );
                }
                const isOpen = expandedRows.includes(params.row.id);

                return (
                    <Box
                        sx={{
                            cursor:'pointer',
                            color:'#1976d2',
                            fontWeight:'bold'
                        }}
                        onClick={(e)=>{
                            e.stopPropagation();
                            handleToggleEmployees(params.row.id);
                        }}
                    >
                        {isOpen
                            ? 'Hide Employees'
                            : 'Show Employees'}
                    </Box>
                );
            }
        
        }
      ];
   } 
  // for showing and hiding employees content 
   const handleToggleEmployees = (rowId) => {

    setExpandedRows((prev) =>
        prev.includes(rowId)
            ? prev.filter((id) => id !== rowId)
            : [...prev, rowId]
    );
};


    const rowsWithDetails = []; // will hold all the rows: regular department rows and employees content rows 

    rows.forEach((row) => {

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
       <StyledTable rows={rowsWithDetails} columns={columns} paginationModel={paginationModel} pageSizes={[5,10,20,30]} title="Departments" loading={loadingDepartments} includeCheckboxes={true} ref={tableRef} />   
    </Box>
  )
}

export default Departments