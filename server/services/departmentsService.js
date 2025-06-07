const departmentsRepo = require('../repositories/departmentsRepo');

const getAllDepartments =  (filters)=>
{
    return departmentsRepo.getAllDepartments(filters);   
}

const getDepartmentsNames = ()=>
{
    return departmentsRepo.getAllDepartmentsNames()
}

const getDepartmentById = (id) =>
{
    return departmentsRepo.getDepartmentById(id);
}

const getDepartmentByName = (name) =>
{
    return departmentsRepo.getDepartmentByName(name);
}

const addDepartment = (deptObj) =>
{
    return departmentsRepo.addDepartment(deptObj);
}

const updateDepartment = ( id, deptObj)=>{
    return departmentsRepo.updateDepartment(id,deptObj);
}

const deleteDepartment = (id) =>{
    return departmentsRepo.deleteDepartment(id);
}

module.exports = {
    getAllDepartments,
    getDepartmentById,
    getDepartmentsNames,
    getDepartmentByName,
    addDepartment,
    updateDepartment,
    deleteDepartment,
}