const departmentsService = require('../services/departmentsService');
const errlogger = require('../utils/logger');
const validator = require('../utils/validator');
const usersService = require('../services/usersService');
const employeesService = require('../services/employeesService');


const getAllDepartments =  async (req,res,next)=>{
    try
    {
        // option : getAllDepartments({ name: "HR" });
        const departments = await departmentsService.getAllDepartments();
        if (!departments)
        {
            return res.status(204).json({ message: 'The request was successful, but there are no departments yet'});
        }
        await usersService.logUserAction(req.user.userId,"getAllDepartments");
        return res.status(200).json(departments);   
    }  
    catch(err)
    {
        errlogger.error(`getAllDepartments failed: ${err.message}`, { stack: err.stack });
        return next(err);          
    }
}

const getAllManagers = async (req,res,next) =>{
    try
    {
        const managers = await departmentsService.getAllManagers();
        if (!managers)
        {
            return res.status(204).json({ message: 'The request was successful, but there are no managers yet'});
        }
         await usersService.logUserAction(req.user.userId,"getAllManagers");
        return res.status(200).json(managers);   
    }
    catch(err)
    {
        errlogger.error(`getAllManagers failed: ${err.message}`, { stack: err.stack });
        return next(err);          
    }
}

const getDepartmentsNames = async (req,res,next) =>
{
    try
    {
        const departments = await departmentsService.getDepartmentsNames();
         if (!departments)
        {
            return res.status(204).json({ message: 'The request was successful, but there are no departments yet'});
        }
        await usersService.logUserAction(req.user.userId,"getDepartmentsNames");
        return res.status(200).json(departments);   
    }
    catch(err)
    {
        errlogger.error(`getDepartmentsNames failed: ${err.message}`, { stack: err.stack });
        return next(err);         
    }
}

const getDepartmentEditInfo =  async (req,res,next) =>{
       try
       {
            const id = req.params.id;
        
            // check if id is a valid mongo id 
            let result = validator.validateEntityId(id,'Department');
            if (result)
            {
                return next(result);                
            }

            // chekc if the department exists 
            const departmentDoc = await departmentsService.getDepartmentById(id);
            if (!departmentDoc) 
            {
                return next({status:404, message:`The department ${id} does not exist`});                
            }
            const outsideEmployees = await employeesService.getOutsideDepartmentEmployees(id);

            const department = departmentDoc.toObject(); // turning mongoose document to regular javascript object 
            department.externalEmployees = outsideEmployees;
            await usersService.logUserAction(req.user.userId,"getDepartmentEditInfo");
            return res.status(200).json(department);    
       }
       catch(err)
        {
            errlogger.error(`getDepartmentEditInfo failed: ${err.message}`, { stack: err.stack });
            return next(err);              
        }
}

const getDepartmentById = async (req,res,next) => {
    try
    {
        const id = req.params.id;
        
        // check if id is a valid mongo id 
        let result = validator.validateEntityId(id,'Department');
        if (result)
        {
            return next(result);            
        }

        // chekc if the department exists 
        const department = await departmentsService.getDepartmentById(id);
        if (!department) 
        {
            return next({status:404, message:`The department ${id} does not exist` });
        }
        await usersService.logUserAction(req.user.userId,"getDepartmentById");
        return res.status(200).json(department);        
    }
    catch(err)
    {
        errlogger.error(`getDepartmentById failed: ${err.message}`, { stack: err.stack });
        return next(err);        
    }
}

const addDepartment = async (req,res,next)=>
{
    try
    {
        const name = req.body.name;
        const managerId = req.body.managerId;
        
        let result = await validator.validateDepartmentInfo(name, managerId);
        if ( result)
        {
            return next(result);
        }

        const existingDepartment = await departmentsService.getDepartmentByName(name);
        if (existingDepartment)
        {
            return next({status:409,message:`A department with the name: ${name} already exists`});            
        }

        const newDepartment = await departmentsService.addDepartment({ name, managerId} );
        await usersService.logUserAction(req.user.userId,"addDepartment");
        return res.status(201).json(newDepartment);
    }
    catch(err)
    {
        errlogger.error(`addDepartment failed: ${err.message}`, { stack: err.stack });
        return next(err);        
    }
}

const updateDepartment = async (req,res,next) =>
{
    try
    {
          const id = req.params.id;
          const deptObj = req.body;
          let result1;

          const result = validator.validateEntityId(id,'Department');
          if (result)
          {
            return next(result);            
          }

          const department = await departmentsService.getDepartmentById(id);
          if (!department)
          {
             return next({status:404, message:`Department with id ${id} does not exist`});
          }

          // flags detecting which fields were provided 
          const nameProvided =   Object.prototype.hasOwnProperty.call(deptObj, 'name');
          const managerIdProvided =  Object.prototype.hasOwnProperty.call(deptObj, 'managerId');

          // to enable partial sending of department data, complete missing fields from current department:
          const name = nameProvided ? deptObj.name:department.name;
          const managerId = managerIdProvided ? deptObj.managerId: department.managerId.toString();

          const newEmployeesProvided = Object.prototype.hasOwnProperty.call(req.body, 'newEmployees');
          
          if (newEmployeesProvided)
           {
                result1 =  await validator.validateEmployees('newEmployees',req.body);       
                if (result1.status !=='O.K')
                {
                    return next(result1);                   
                }
            }


          const result2 = await validator.validateDepartmentInfo(name,managerId);
          if ( result2)
          {
                return next(result2);            
          }
          const updatedDept = await departmentsService.updateDepartment(id,{name,managerId});
          const newEmployees = deptObj.newEmployees;
          if (Array.isArray(newEmployees) && newEmployees.length>0)
          {
               await employeesService.updateEmployeesDepartment(newEmployees, id);
          }
          await usersService.logUserAction(req.user.userId,"updateDepartment");
          return res.status(200).json(updatedDept);
    }
    catch(err)
    {
        errlogger.error(`updateDepartment failed: ${err.message}`, { stack: err.stack });
        return next(err);        
    }
}


const deleteDepartment = async (req,res,next) =>
{
    try
    {
        const id = req.params.id;
        const result = validator.validateEntityId(id,'Department');
        if (result)
        {
            return next(result);            
        }
        const exists = await departmentsService.departmentExists(id);
        if (!exists)
        {
            return next({status:404,message:`Department with id ${id} does not exist`});
        }
        // todo: delete department employees 
        const deletedDepartment = await departmentsService.deleteDepartment(id);
        await usersService.logUserAction(req.user.userId,"deleteDepartment");
        return res.status(200).json(deletedDepartment);
    }
    catch(err)
    {
        errlogger.error(`deleteDepartment failed: ${err.message}`, { stack: err.stack });
        return next(err);        
    }
}

module.exports = {
    getAllDepartments,
    getAllManagers,
    getDepartmentsNames,
    getDepartmentById,
    getDepartmentEditInfo,
    addDepartment,
    updateDepartment,
    deleteDepartment 
}