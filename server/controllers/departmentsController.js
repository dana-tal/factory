const departmentsService = require('../services/departmentsService');
const errlogger = require('../utils/logger');

const getAllDepartments =  async (req,res)=>{
    try
    {
        // option : getAllDepartments({ name: "HR" });
        const departments = await departmentsService.getAllDepartments();
        res.json(departments);   
    }  
    catch(err)
    {
        //console.log('getAllDepartments error:');
        // console.log(err);
        errlogger.error(`getAllDepartments failed: ${err.message}`, { stack: err.stack });
        res.status(500).json(err);  
    }
}

module.exports = {
    getAllDepartments
}