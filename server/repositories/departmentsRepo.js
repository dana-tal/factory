const Department = require('../models/departmentModel');

const getAllDepartments = (filters)=>{
    return Department.find(filters);
}

module.exports = {
    getAllDepartments
}