import { api  } from "./generalFuncs";

const requestAllDepartments = async ()=>
{
    const response = await api.get('/departments');
    return response.data;
}


export 
{
    requestAllDepartments,
}
