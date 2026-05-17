import { api  } from "./generalFuncs";

const requestAllDepartments = async ()=>
{
    const response = await api.get('/departments');
    return response.data;
}

const requestDepartmentById = async (deptId) =>
{
     const response = await api.get('/departments/'+deptId);
     return response.data;
}

const requestAllManagers = async ()=>
{
    const response = await api.get('/departments/managers');
    return response.data;
}



const requestDepartmentAdd = async (dept_obj) =>{
       const response = await api.post( '/departments', {name: dept_obj.name, managerId: dept_obj.managerId } );
       return response.data;
}

const requestRemoveDepartments = async (ids) => 
{
    const promises = ids.map(id => api.delete('/departments/' + id));
    const responses = await Promise.all(promises);
    return responses;
};


export 
{
    requestAllDepartments,
    requestAllManagers,
    requestDepartmentById,
    requestDepartmentAdd,
    requestRemoveDepartments
}
