
const employeeRepo = require('../repositories/employeeRepo');


const getEmployeeById = (id)=>{

    return employeeRepo.getEmployeeById(id);
}


module.exports ={
    getEmployeeById
}