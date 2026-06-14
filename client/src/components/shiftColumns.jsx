import RowField from "./RowField";
import { Box } from "@mui/material";
import { formatDate } from "../utils/generalFuncs";
import { Link } from "react-router-dom";

const getMobileColumns = () =>
{
    return [
        {
            field:'id',
            headerName: 'Id',
            sortable:true,
            filterable:true
        },
        {
            field: 'startDate',
            type:'date',
            headerName: 'Start Date',
            sortable: true,
            filterable: true,   
            valueGetter: (value) => value ? new Date(value) : null,
            valueFormatter: (value) => formatDate(value),          
        },
        {
            field:'endDate',
            type:'date',
            headerName:'End Date',
            sortable:true,
            filterable:true,
            valueGetter: (value) => value ? new Date(value) : null,
            valueFormatter: (value) => formatDate(value),  
        },        
        {
            field: 'mobileView',
            headerName: '',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => { 
                const row = params.row;    
                const  jsx  =  <Box sx={{ width: '100%' }}>
                                    <RowField label="Id :" value={<Link to={`/shifts/${row.id}`}>{row.id}</Link>} />
                                    <RowField label="Start Date :" value={formatDate(row.startDate)} />
                                    <RowField label="End Date :" value={formatDate(row.endDate)} />                                   
                            </Box> 
                return jsx;
            }
        }
    ];
}

const getDesktopColumns = ()=>{

    return [
         {
          field:'id',
          headerName:'Shift Id',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,
          valueGetter: (value,row)=>`${row.id}`,
          renderCell: (params)=>{
               const row = params.row ;
              return <Link to={`/shifts/${row.id}`}>{row.id}</Link>
          }
        }, 
        {
          field:'startDate',
          headerName:'Start Date',
          type:'date',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,      
          valueGetter: (value) => value ? new Date(value) : null,
         valueFormatter: (value) => formatDate(value),
        }, 
        {
          field:'endDate',
          headerName:'End Date',
          type:'date',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,   
          valueGetter: (value) => value ? new Date(value) : null,
            valueFormatter: (value) => formatDate(value),  
        }, 
        
    ];
}




export const getShiftColumns = ({isMobile}) =>
{
  return isMobile ? getMobileColumns():getDesktopColumns();
};