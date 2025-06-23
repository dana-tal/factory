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

const updateEmployee = async (req,res)=>{

    try
    {
        const id = req.params.id;
     
        let result = validator.validateEntityId(id,'Employee');
        if (result)
        {
            return res.status(result.status).json(result.message);
        }

        const currentEmployee = await employeesService.getEmployeeById(id);
        if (!currentEmployee)
        {
             return res.status(404).json(`Employee with id ${id} does not exist`);
        }

        // to enable partial update:
        const firstNameProvided =  Object.prototype.hasOwnProperty.call(req.body, 'firstName');
        const lastNameProvided  =  Object.prototype.hasOwnProperty.call(req.body, 'lastName');
        const startYearProvided =   Object.prototype.hasOwnProperty.call(req.body, 'startYear');
        const departmentIdProvided = Object.prototype.hasOwnProperty.call(req.body, 'departmentId');

        const firstName = firstNameProvided ? req.body.firstName: currentEmployee.firstName;
        const lastName =  lastNameProvided ? req.body.lastName: currentEmployee.lastName;
        const startYear = startYearProvided ? req.body.startYear: currentEmployee.startYear;
        const departmentId = departmentIdProvided ? req.body.departmentId: currentEmployee.department.id;  
        
        result = await validator.validateEmployeeInfo(firstName,lastName,startYear,departmentId);
        if (result)
        {
            return res.status(result.status).json(result.message);
        }

        const updatedEmployee = await employeesService.updateEmployee(id,{ firstName,lastName,startYear,departmentId});
        return res.status(200).json(updatedEmployee);
    }
    catch(err)
    {
        errlogger.error(`updateEmployee failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }

}

const deleteEmployee = async (req,res)=>{

    try
    {
        const id = req.params.id;
        const result = validator.validateEntityId(id,'Employee');
        if (result)
        {
            return res.status(result.status).json(result.message);
        }

        const exists = await employeesService.employeeExists(id);
        if (!exists)
        {
            return res.status(404).json(`Employee with id ${id} does not exist`);
        }
        const deletedEmployee = await employeesService.deleteEmployee(id);
        return res.status(200).json(deletedEmployee);
    }
    catch(err)
    {
        errlogger.error(`deleteEmployee failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }
}


const registerEmployeeToShifts = async (req,res)=>{

    try
    {
         const empId = req.params.id;
         const newShifts = req.body.newShifts;

         const registerResult = await employeesService.registerEmployeeToShifts(empId,newShifts);
         return res.status(200).json(registerResult);
    }
    catch(err)
    {
       errlogger.error(`registerEmployeeToShifts failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err); 
    }
}

const unregisterEmployeeFromShifts = async (req,res) =>{

    try
    {
        const empId = req.params.id;
        const removeShifts = req.body.removeShifts;
        
        const unregisterResult = await employeesService.unregisterEmployeeFromShifts(empId,removeShifts);
         return res.status(200).json(unregisterResult);
    }
    catch(err)
    {
       errlogger.error(`unregisterEmployeeFromShifts failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err); 
    }
}

module.exports = { 
    getAllEmployees,
    getEmployeeById,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    registerEmployeeToShifts,
    unregisterEmployeeFromShifts
}