const Employee = require('../models/employeeModel');

const getAllEmployees = (filters)=>{
    return Employee.find(filters).populate({ path:'departmentId', select:'name'});
}

const getEmployeeById = (id)=>{
    return Employee.findById(id).populate({ path:'departmentId', select:'name'});
}

const addNewEmployee = (employeeObj)=>{
    const employee = new Employee(employeeObj);
    return employee.save();
}

const updateEmployeesDepartment = (employeeIds, newDeptId) =>{
    return Employee.updateMany (
        { _id: { $in: employeeIds } },
        { $set: { departmentId: newDeptId }}
    )
}


const employeeExists = (id) =>{
    return Employee.exists({ _id: id}); 
}



module.exports = {
    getAllEmployees,
    getEmployeeById,
    addNewEmployee,
    updateEmployeesDepartment,
    employeeExists
  
}