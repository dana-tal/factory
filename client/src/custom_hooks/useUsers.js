import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { requestAllUsers } from "../utils/userRequest";

export const useUsers = () =>
{
    const [loadingUsers, setLoadingUsers] = useState(false); 
    const [rows, setRows] = useState([]);      // will hold a row for each employee 
      
    const paginationModel = { page: 0, pageSize: 10 };
    const isMobile = useMediaQuery('(max-width:480px)');

    const fetchUsers = async ()=>
    {
        try
        {
            setLoadingUsers(true);
            const allUsers =  await requestAllUsers();
            setRows(allUsers);
            setLoadingUsers(false);         
        }
        catch(err)
        {
            if (err.cancelled) // prevent further execution in case the system performed automatic logout (dailyLimit reached)
            {
                return;
            }
            console.log("fetchUsers error: ",err);
        }
    }
     
    return { loadingUsers, fetchUsers, paginationModel,isMobile,rows}
}