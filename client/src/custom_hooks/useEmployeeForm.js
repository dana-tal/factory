import { useState } from "react";
import { requestAllDepartments } from "../utils/departmentRequest";
import { requestEmployeeById } from "../utils/employeeRequest";

export const useEmployeeForm = () =>{

    const [departments, setDepartments] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
   
    const fetchAllDepartments = async ()=>
    {
        try
        {
            const allDepartments = await requestAllDepartments();           
            setDepartments(allDepartments);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const fetchEmployee = async (id)=>
    {
        try
        {
            const response = await requestEmployeeById(id);
            setSelectedEmployee(response);                
        }
        catch(err)
        {
            console.log(err);
        }
    } 

    return { departments,fetchAllDepartments,selectedEmployee,fetchEmployee};
} 