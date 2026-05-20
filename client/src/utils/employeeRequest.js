import { api  } from "./generalFuncs";

const requestAllEmployees = async ()=>
{
    const response = await api.get('/employees');
    return response.data;
}

const requestEmployeeById = async (empId) =>
{
    const response = await api.get('/employees/editInfo/'+empId);
    return response.data;
}


const requestEmployeeAdd = async ( emp_obj) =>
{
    const response = await api.post('/employees', {...emp_obj });
    return response.data;
}

const requestEmployeeUpdate = async ( emp_obj) =>
{
    const response = await api.put('/employees/'+emp_obj.id, { ...emp_obj });
    return response.data;
}


const requestRemoveEmployees = async (ids) => 
{
    const promises = ids.map(id => api.delete('/employees/' + id));
    const responses = await Promise.all(promises);
    return responses;
};

const requestEmployeeRegister = async (empId, newShifts) =>
{
    const response = await api.post('/employees/register/'+empId, { newShifts });
    return response.data;
}

const requestEmployeeUnregister = async (empId, removeShifts ) =>
{
    const response = await api.post('/employees/unregister/'+empId, { removeShifts });
    return response.data; 
}


export
{
    requestAllEmployees,
    requestEmployeeById,
    requestEmployeeAdd,
    requestEmployeeUpdate,
    requestRemoveEmployees,
    requestEmployeeRegister,
    requestEmployeeUnregister
}
