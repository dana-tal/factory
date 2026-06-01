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
        setLoadingUsers(true);
        const allUsers =  await requestAllUsers();
       // console.log("allUsers:",allUsers);
        setRows(allUsers);
        setLoadingUsers(false);         
    }
     
    return { loadingUsers, fetchUsers, paginationModel,isMobile,rows}
}