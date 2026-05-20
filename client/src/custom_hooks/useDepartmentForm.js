import { useState } from "react";
import { requestAllEmployees } from "../utils/employeeRequest";
import { requestDepartmentById } from "../utils/departmentRequest";

export const useDepartmentForm = () =>{

    const [managers, setManagers] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
   
    const fetchAllEmployees = async ()=>
    {
        try
        {
            const allManagers = await requestAllEmployees();           
            setManagers(allManagers);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const fetchDepartment = async (id)=>
    {
        try
        {
            const response = await requestDepartmentById(id);
            setSelectedDepartment(response);                
        }
        catch(err)
        {
            console.log(err);
        }
    } 

    return { managers,fetchAllEmployees,selectedDepartment,fetchDepartment};
} 