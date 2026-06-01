import RowField from "./RowField";
import { Box } from "@mui/material";


const getMobileColumns = () =>
{
    return [
        {
            field:'fullName',
            headerName: 'Full Name',
            sortable:true,
            filterable:true
        },
        {
            field: 'maxActions',
            headerName: 'Max Actions',
            sortable: true,
            filterable: true,             
        },
        {
            field:'username',
            headerName:'Username',
            sortable:true,
            filterable:true
        },
        {
            field:'email',
            headerName:'Email',
            sortable: true,
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
                                    <RowField label="Full Name :" value={row.fullName} />
                                    <RowField label="Max Actions :" value={row.maxActions} />
                                    <RowField label="Username :" value={row.username} />
                                    <RowField label="Email :" value={row.email} />
                            </Box> 
                return jsx;
            }
        }
    ];
}

const getDesktopColumns = ()=>{

    return [
         {
          field:'fullName',
          headerName:'Full Name',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,
          valueGetter: (value,row)=>`${row.fullName}`,
        }, 
        {
          field:'maxActions',
          headerName:'Max Actions',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,      
        }, 
        {
          field:'username',
          headerName:'Username',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,
          valueGetter: (value,row)=>`${row.username}`,
        }, 
         {
          field:'email',
          headerName:'Email',
          flex:1,
          align:'left',
          sortable:true,
          filterable:true,
          valueGetter: (value,row)=>`${row.email}`,
        }, 
    ];
}




export const getUserColumns = ({isMobile}) =>
{
  return isMobile ? getMobileColumns():getDesktopColumns();
};