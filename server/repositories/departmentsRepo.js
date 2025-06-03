const Department = require('../models/departmentModel');
const Employee = require('../models/employeeModel'); 

const getAllDepartments = (filters)=>{
    return Department.find(filters).populate({
        path: 'employees',
        select: '_id firstName lastName -departmentId' 
    })
    .populate({ 
        path:'manager',
        select:'_id firstName lastName'
    });
}

const getDepartmentById = (id) =>{
    return Department.findById(id);
}



module.exports = {
    getAllDepartments,
    getDepartmentById 
}