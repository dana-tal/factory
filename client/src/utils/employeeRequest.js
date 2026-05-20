import { api  } from "./generalFuncs";

const requestAllEmployees = async ()=>
{
    const response = await api.get('/employees');
    return response.data;
}


export
{
    requestAllEmployees
}
