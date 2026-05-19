import { Box } from "@mui/material";
import RowField from "./RowField";
import { Link } from "react-router-dom";

const renderEmployeesList = (employees) => (
  <Box sx={{ p: 2 }}>
    {employees.map((emp) => (
      <Box key={emp.id}>
        {emp.firstName} {emp.lastName}
      </Box>
    ))}
  </Box>
);



const toggleBoxStyle = { cursor: "pointer", color: "#1976d2", fontWeight: "bold" };


const ToggleBox = ({isOpen,rowId, handleToggleEmployees})=>{
  
  return <Box sx={toggleBoxStyle}
                        onClick={(e)=>{
                            e.stopPropagation();
                            handleToggleEmployees(rowId);
                        }}
                    >
                        {isOpen ? "Hide Employees" : "Show Employees"}
        </Box>
}
 
const getMobileColumns = ({
  expandedRows,
  handleToggleEmployees,
}) => {

return  [
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
                    jsx = renderEmployeesList(row.employees);
               }
               else 
               {
                  const isOpen = expandedRows.includes(row.id);
                   jsx  =  <Box sx={{ width: '100%' }}>
                                    <RowField label="Department :" value={<Link to={`/departments/${row.id}`}>{row.name}</Link> } />
                                    <RowField label="Manager Name: " value={`${row.manager.firstName} ${row.manager.lastName}`} />
                                    { row.employees.length >0 && <RowField label="Employees: "  value={<ToggleBox  isOpen={isOpen} rowId={row.id} handleToggleEmployees={handleToggleEmployees}/>} /> }
                                    { row.employees.length==0 && <RowField label="Employees: " value="No Employees yet" />}
                            </Box> 

               } 
                return (
                    jsx
                );
              }
            }


       ];

}

const getDesktopColumns = ({
  expandedRows,
  handleToggleEmployees,
}) => {

   return  [
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
              return <Link to={`/departments/${params.row.id}`}>{params.row.name}</Link>;  // for regular row return the department name
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
          /*  valueGetter: (value,row)=> 'Employees', */
            align:'left',
            renderCell: (params) => /*  for employees row show nothing, for regular department row , show  hide/show link */
            {

                if (params.row.isDetailRow) 
                {
                    return (
                      <Box sx={{ p:1 }}>
                        {renderEmployeesList(params.row.employees)}                         
                      </Box>
                  );
                }
                const isOpen = expandedRows.includes(params.row.id);
                const jsx = params.row.employees.length ===0 ? "No Employees yet": (<ToggleBox  isOpen={isOpen} rowId={params.row.id} handleToggleEmployees={handleToggleEmployees}/>);
                return jsx;
            }
        
        }
      ];


};

export const getDepartmentColumns = ({
  isMobile,
  expandedRows,
  handleToggleEmployees,
}) => {
  return isMobile
    ? getMobileColumns({ expandedRows, handleToggleEmployees })
    : getDesktopColumns({ expandedRows, handleToggleEmployees });
};