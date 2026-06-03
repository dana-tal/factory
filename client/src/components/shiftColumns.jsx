import RowField from "./RowField";
import { Box } from "@mui/material";
import { formatDate } from "../utils/generalFuncs";


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
            headerName: 'Start Date',
            sortable: true,
            filterable: true,             
        },
        {
            field:'endDate',
            headerName:'End Date',
            sortable:true,
            filterable:true
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
                                    <RowField label="Id :" value={row.id} />
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
        }, 
        {
          field:'startDate',
          headerName:'Start Date',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,      
        valueGetter: (value,row)=>`${formatDate(row.startDate)}`,
        }, 
        {
          field:'endDate',
          headerName:'End Date',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,   
           valueGetter: (value,row)=>`${formatDate(row.endDate)}`,     
        }, 
        
    ];
}




export const getShiftColumns = ({isMobile}) =>
{
  return isMobile ? getMobileColumns():getDesktopColumns();
};