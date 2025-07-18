const departmentsRepo = require('../repositories/departmentsRepo');
const employeesRepo = require('../repositories/employeesRepo');

const getAllDepartments =  (filters)=>
{
    return departmentsRepo.getAllDepartments(filters);   
}

const getDepartmentsNames = ()=>
{
    return departmentsRepo.getAllDepartmentsNames()
}

const getDepartmentById = async (id) =>
{
    const departmentDoc = await  departmentsRepo.getDepartmentById(id);

    const department = departmentDoc.toObject(); // turning mongoose document to regular javascript object 
    const outsideEmployees = await employeesRepo.getEmployeesOutsideDepartment(id);
    department.external_employees = outsideEmployees;
    return department ;
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

const departmentExists = (id)=>{
    return departmentsRepo.departmentExists(id);
}


module.exports = {
    getAllDepartments,
    getDepartmentById,
    getDepartmentsNames,
    getDepartmentByName,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    departmentExists
}