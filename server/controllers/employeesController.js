const employeesService = require('../services/employeesService');
const errlogger = require('../utils/logger');
const validator = require('../utils/validator');

const getAllEmployees = async (req,res)=>{
    try
    {
        const employees = await employeesService.getAllEmployees();
        if (!employees)
        {
            return res.status(204).json({ message: 'The request was successful, but there are no employees yet'});
        }
        res.status(200).json(employees);
    }
    catch(err)
    {
        errlogger.error(`getAllEmployees failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);  
    }

}

const getEmployeeById = async (req,res) =>{
    try
    {
        const id = req.params.id;
        let result = validator.validateEntityId(id,'Employee');
        if (result)
        {
            return res.status(result.status).json(result.message);
        }
        
        const employee = await employeesService.getEmployeeById(id);
        if (!employee) 
        {
            return res.status(404).json({ message: `The employee ${id} does not exist` });
        }
        res.status(200).json(employee);
    }
    catch(err)
    {
        errlogger.error(`getEmployeeById failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }
}

const addNewEmployee = async (req,res)=>{
    try
    {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const startYear = req.body.startYear;
        const departmentId = req.body.departmentId;

        // validate all the inputs 
        let result = await validator.validateEmployeeInfo(firstName,lastName,startYear,departmentId);
        if (result)
        {
            return res.status(result.status).json(result.message);
        }
        const newEmployee = await employeesService.addNewEmployee({ firstName,lastName,startYear,departmentId});
        return res.status(200).json(newEmployee);
    }
    catch(err)
    {
         errlogger.error(`addEmployee failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }
}

// todo :
// check add employee with errors
// updateEmployee
// deleteEmployee


module.exports = { 
    getAllEmployees,
    getEmployeeById,
    addNewEmployee
}