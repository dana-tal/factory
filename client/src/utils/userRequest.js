import { api  } from "./generalFuncs";


const requestAllUsers = async ()=>
{
    const response = await api.get('/users');
    return response.data;
}

export
{
    requestAllUsers
}
