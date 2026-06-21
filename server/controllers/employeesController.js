const employeesService = require('../services/employeesService');
const usersService = require('../services/usersService');
const departmentsService = require('../services/departmentsService');

const errlogger = require('../utils/logger');
const validator = require('../utils/validator');

const getAllEmployees = async (req,res,next)=>{
    try
    {
        const employees = await employeesService.getAllEmployees();
        if (!employees)
        {
            return res.status(204).json({ message: 'The request was successful, but there are no employees yet'});
        }
        await usersService.logUserAction(req.user.userId,"getAllEmployees");
        res.status(200).json(employees);
    }
    catch(err)
    {
        errlogger.error(`getAllEmployees failed: ${err.message}`, { stack: err.stack });
        return next(err);      
    }

}

const getAllEmployeesAndDepartments = async (req,res,next) =>{

    try
    {
        const employees = await employeesService.getAllEmployees();
        if (!employees)
        {
            return res.status(204).json({ message: 'The request was successful, but there are no employees yet'});
        }
        const departments = await departmentsService.getAllDepartments();
       
        const response = { employees, departments };
        await usersService.logUserAction(req.user.userId,"getAllEmployeesAndDepartments");
        return res.status(200).json(response);
    }
    catch(err)
    {
        errlogger.error(`getAllEmployeesAndDepartments failed: ${err.message}`, { stack: err.stack });
        return next(err);            
    }

}


const getEmployeeEditInfo = async (req,res,next) =>{

    try
    {
        const id = req.params.id;
        let result = validator.validateEntityId(id,'Employee');
        if (result)
        {
            return next(result);
        }
        
        const employee = await employeesService.getEmployeeEditInfo(id);
        if (!employee) 
        {
            const err= { status:404, message: `The employee ${id} does not exist` }
            return next(err);
        }
        employee.department_names = await departmentsService.getDepartmentsNames();
        await usersService.logUserAction(req.user.userId,"getEmployeeEditInfo");
        return res.status(200).json(employee);
    }
    catch(err)
    {
        errlogger.error(`getEmployeeEditInfo failed: ${err.message}`, { stack: err.stack });
        return next(err);     
    }

}

const getEmployeeById = async (req,res,next) =>{
    try
    {
        const id = req.params.id;
        let result = validator.validateEntityId(id,'Employee');
        if (result)
        {
           return next(result);
        }
        
        const employee = await employeesService.getEmployeeById(id);
        if (!employee) 
        {
            return next({status:404, message: `The employee ${id} does not exist` });
        }
        await usersService.logUserAction(req.user.userId,"getEmployeeById");
        return res.status(200).json(employee);
    }
    catch(err)
    {
        errlogger.error(`getEmployeeById failed: ${err.message}`, { stack: err.stack });
        return next(err);      
    }
}

const addNewEmployee = async (req,res,next)=>{
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
            return next(result);            
        }
        const newEmployee = await employeesService.addNewEmployee({ firstName,lastName,startYear,departmentId});
        await usersService.logUserAction(req.user.userId,"addNewEmployee");
        return res.status(200).json(newEmployee);
    }
    catch(err)
    {
         errlogger.error(`addEmployee failed: ${err.message}`, { stack: err.stack });
         return next(err);      
    }
}

const updateEmployee = async (req,res,next)=>{

    try
    {
        const id = req.params.id;
     
        let result = validator.validateEntityId(id,'Employee');
        if (result)
        {
            return next(result);            
        }

        const currentEmployee = await employeesService.getEmployeeById(id);
        if (!currentEmployee)
        {
            return next({status:404, message:`Employee with id ${id} does not exist`})
        }

        // to enable partial update:
        const firstNameProvided =  Object.prototype.hasOwnProperty.call(req.body, 'firstName');
        const lastNameProvided  =  Object.prototype.hasOwnProperty.call(req.body, 'lastName');
        const startYearProvided =   Object.prototype.hasOwnProperty.call(req.body, 'startYear');
        const departmentIdProvided = Object.prototype.hasOwnProperty.call(req.body, 'departmentId');
        const newShiftsProvided = Object.prototype.hasOwnProperty.call(req.body, 'newShifts');

        const firstName = firstNameProvided ? req.body.firstName: currentEmployee.firstName;
        const lastName =  lastNameProvided ? req.body.lastName: currentEmployee.lastName;
        const startYear = startYearProvided ? req.body.startYear: currentEmployee.startYear;
        const departmentId = departmentIdProvided ? req.body.departmentId: currentEmployee.department.id;  
        const newShifts = newShiftsProvided ? req.body.newShifts: null;
        
        if (newShiftsProvided)
        {
            result =  await validator.validateShifts('newShifts',req.body);       
            if (result.status !=='O.K')
            {
                return next(result);
            }
        }
        
        result = await validator.validateEmployeeInfo(firstName,lastName,startYear,departmentId);
        if (result)
        {
            return next(result);           
        }

        const updatedEmployee = await employeesService.updateEmployee(id,{ firstName,lastName,startYear,departmentId});

        if (newShifts && newShifts.length >0 )
        {
            const registerResult = await employeesService.registerEmployeeToShifts(id,newShifts);
            updatedEmployee.registerResult = registerResult ;
        }

        await usersService.logUserAction(req.user.userId,"updateEmployee");
        return res.status(200).json(updatedEmployee);
    }
    catch(err)
    {
        errlogger.error(`updateEmployee failed: ${err.message}`, { stack: err.stack });
        return next(err);        
    }

}

const deleteEmployee = async (req,res,next)=>{

    try
    {
        const id = req.params.id;
        const result = validator.validateEntityId(id,'Employee');
        if (result)
        {
            return next(result);           
        }

        const exists = await employeesService.employeeExists(id);
        if (!exists)
        {
           return next({status:404, message:`Employee with id ${id} does not exist`});
        }

        const deleteResult = await employeesService.deleteEmployee(id);
        await usersService.logUserAction(req.user.userId,"deleteEmployee");
        return res.status(200).json(deleteResult);
    }
    catch(err)
    {
        errlogger.error(`deleteEmployee failed: ${err.message}`, { stack: err.stack });
        return next(err);      
    }
}


const registerEmployeeToShifts = async (req,res,next)=>{

    try
    {
        const empId = req.params.id;
        
        let  result = validator.validateEntityId(empId,'Employee'); // verify the empId is syntactically valid 
        if (result)
        {
            return next(result);
        }
        const exists = await employeesService.employeeExists(empId); // verifiy the employee exists 
        if (!exists)
        {
            return next({status:404, message:`Employee with id ${empId} does not exist`});            
        }

        result =  await validator.validateShifts('newShifts',req.body);       
        if (result.status !=='O.K')
        {
            return next(result);           
        }
       
        const newShifts = req.body.newShifts;
        const registerResult = await employeesService.registerEmployeeToShifts(empId,newShifts);
        await usersService.logUserAction(req.user.userId,"registerEmployeeToShifts");
        return res.status(200).json(registerResult);
    }
    catch(err)
    {
       errlogger.error(`registerEmployeeToShifts failed: ${err.message}`, { stack: err.stack });
       return next(err);        
    }
}

const unregisterEmployeeFromShifts = async (req,res,next) =>{

    try
    {
        const empId = req.params.id;

         let  result = validator.validateEntityId(empId,'Employee'); // verify the empId is syntactically valid 
        if (result)
        {
            return next(result);           
        }
        const exists = await employeesService.employeeExists(empId); // verifiy the employee exists 
        if (!exists)
        {
            return next({status:404, message:`Employee with id ${empId} does not exist`});
        }

        result =  await validator.validateShifts('removeShifts',req.body);
      
        if (result.status !=='O.K')
        {
            return next(result);           
        }

        const removeShifts = req.body.removeShifts;
        
        const unregisterResult = await employeesService.unregisterEmployeeFromShifts(empId,removeShifts);
        await usersService.logUserAction(req.user.userId,"unregisterEmployeeFromShifts");
         return res.status(200).json(unregisterResult);
    }
    catch(err)
    {
       errlogger.error(`unregisterEmployeeFromShifts failed: ${err.message}`, { stack: err.stack });
       return next(err);        
    }
}

module.exports = { 
    getAllEmployees,
    getAllEmployeesAndDepartments,
    getEmployeeById,
    getEmployeeEditInfo,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    registerEmployeeToShifts,
    unregisterEmployeeFromShifts
}