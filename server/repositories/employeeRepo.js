const Employee = require('../models/employeeModel');


const getEmployeeById = (id)=>{
    return Employee.findById(id);
}

module.exports = {
    getEmployeeById 
}