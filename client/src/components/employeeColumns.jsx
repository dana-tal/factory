import { Box } from "@mui/material";
import RowField from "./RowField";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/generalFuncs";


const renderShiftsList = (shifts) => (
  <Box sx={{ p: 1 ,paddingLeft:0, textAlign:'left'}}>
    {shifts.map((shift) => (
      <Box key={shift.id}>
            <div style={{ display: "flex", gap: "15px" }}>
              <span>start: {formatDate(shift.startDate)}</span>
              <span>end: {formatDate(shift.endDate)}</span>
            </div>
      </Box>
    ))}
  </Box>
);

const toggleBoxStyle = { cursor: "pointer", color: "#1976d2", fontWeight: "bold" };


const ToggleBox = ({isOpen,rowId, handleToggleShifts})=>
{  
  return <Box sx={toggleBoxStyle}
                        onClick={(e)=>{
                            e.stopPropagation();
                            handleToggleShifts(rowId);
                        }}
                    >
                        {isOpen ? "Hide Shifts" : "Show Shifts"}
        </Box>
}
 
const getMobileColumns = ({ expandedRows, handleToggleShifts,}) => 
{
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
                    jsx = renderShiftsList(row.shifts);
               }
               else 
               {
                  const isOpen = expandedRows.includes(row.id);
                   jsx  =  <Box sx={{ width: '100%' }}>
                                    <RowField label="Employee :" value={<Link to={`/employees/${row.id}`}>{`${row.firstName} ${row.lastName}`}</Link> } />
                                    <RowField label="Department: " value={ <Link to={`/departments/${row.department.id}`}>{row.department.name}</Link> } />
                                    { row.shifts.length >0 && <RowField label="Shifts: "  value={<ToggleBox  isOpen={isOpen} rowId={row.id} handleToggleEmployees={handleToggleShifts}/>} /> }
                                    { row.shifts.length==0 && <RowField label="Shifts: " value="No Shifts yet" />}
                            </Box> 

               } 
                return (
                    jsx
                );
              }
            }


       ];

}


const getDesktopColumns = ({expandedRows,handleToggleShifts,}) => 
{
    return [
         {
          field:'emp_name',
          headerName:'Employee Name',
          flex:1,
          align:'left',
          sortable:true,
          valueGetter: (value, row) =>{ return `${row.firstName} ${row.lastName}`} ,
          renderCell:(params)=>
          {
              if(params.row.isDetailRow) 
              {
                return null;
              }
              return <Link to={`/employees/${params.row.id}`}>{`${params.row.firstName} ${params.row.lastName}`}</Link>;  
            }
        }, 
        {
            field:'department_name',
            headerName:'Department',
            flex:1,
            align:'left',
            sortable:true,
             valueGetter: (value, row) =>{ return `${row.department.name}`} ,
            renderCell:(params)=>
            {
              if(params.row.isDetailRow) 
              {
                return null;
              }
              return <Link to={`/departments/${params.row.department.id}`}>{params.row.department.name}</Link>;  
            }
        },
         {
                    field:'shifts',
                    headerName:'Shifts',
                    flex:1,
                    sortable:false,
                    align:'left',
                    renderCell: (params) => 
                    {
        
                        if (params.row.isDetailRow) 
                        {
                            return (
                              <Box sx={{ p:1 }}>
                                {renderShiftsList(params.row.shifts)}                         
                              </Box>
                          );
                        }
                        const isOpen = expandedRows.includes(params.row.id);
                        const jsx = params.row.shifts.length ===0 ? "No Shifts yet": (<ToggleBox  isOpen={isOpen} rowId={params.row.id} handleToggleShifts={handleToggleShifts}/>);
                        return jsx;
                    }
                
                }
    ];
}



export const getEmployeeColumns = ({isMobile,expandedRows, handleToggleShifts,}) =>
{
  return isMobile
    ? getMobileColumns({ expandedRows, handleToggleShifts })
    : getDesktopColumns({ expandedRows, handleToggleShifts });
};