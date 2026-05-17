const departmentsRepo = require('../repositories/departmentsRepo');
const employeeRepo = require('../repositories/employeesRepo');

const getAllDepartments =  (filters)=>
{
    return departmentsRepo.getAllDepartments(filters);   
}

const getAllManagers = ()=>
{
    return departmentsRepo.getAllManagers();
}

const getDepartmentsNames = ()=>
{
    return departmentsRepo.getAllDepartmentsNames()
}


const getDepartmentById = (id) =>{
    return  departmentsRepo.getDepartmentById(id);
}

const getDepartmentByName = (name) =>
{
    return departmentsRepo.getDepartmentByName(name);
}

const addDepartment = async (deptObj) =>
{
    const new_dept = await departmentsRepo.addDepartment(deptObj);
    const manager = await employeeRepo.getEmployeeById(new_dept.managerId);
    new_dept.manager = { id: new_dept.managerId, firstName: manager.firstName, lastName: manager.lastName };    
    return new_dept;
}

const updateDepartment = ( id, deptObj)=>{
   return departmentsRepo.updateDepartment(id,deptObj);
}

const deleteDepartment = (id) =>{
    return departmentsRepo.deleteDepartment(id);
}

const departmentExists = (id)=>{
    return departmentsRepo.departmentExists(id);
}


module.exports = {
    getAllDepartments,
    getAllManagers,
    getDepartmentById,
    getDepartmentsNames,
    getDepartmentByName,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    departmentExists
}