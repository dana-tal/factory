const departmentsRepo = require('../repositories/departmentsRepo');

const getAllDepartments = async (filters)=>
{
    return departmentsRepo.getAllDepartments(filters);   
}




module.exports = {
    getAllDepartments
}