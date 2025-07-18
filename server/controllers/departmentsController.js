const departmentsService = require('../services/departmentsService');
const errlogger = require('../utils/logger');
const validator = require('../utils/validator');
const usersService = require('../services/usersService');
const employeesService = require('../services/employeesService');


const getAllDepartments =  async (req,res)=>{
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
        return res.status(500).json(err);  
    }
}

const getDepartmentsNames = async (req,res) =>
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
        return res.status(500).json(err);  
    }
}

const getDepartmentEditInfo =  async (req,res) =>{
       try
       {
            const id = req.params.id;
        
            // check if id is a valid mongo id 
            let result = validator.validateEntityId(id,'Department');
            if (result)
            {
                return res.status(result.status).json(result.message);
            }

            // chekc if the department exists 
            const departmentDoc = await departmentsService.getDepartmentById(id);
            if (!departmentDoc) 
            {
                return res.status(404).json({ message: `The department ${id} does not exist` });
            }
            const outsideEmployees = await employeesService.getOutsideDepartmentEmployees(id);

            const department = departmentDoc.toObject(); // turning mongoose document to regular javascript object 
            department.externalEmployees = outsideEmployees;
            return res.status(200).json(department);    
       }
       catch(err)
        {
            errlogger.error(`getDepartmentEditInfo failed: ${err.message}`, { stack: err.stack });
            return res.status(500).json(err);  
        }
}

const getDepartmentById = async (req,res) => {
    try
    {
        const id = req.params.id;
        
        // check if id is a valid mongo id 
        let result = validator.validateEntityId(id,'Department');
        if (result)
        {
            return res.status(result.status).json(result.message);
        }

        // chekc if the department exists 
        const department = await departmentsService.getDepartmentById(id);
        if (!department) 
        {
            return res.status(404).json({ message: `The department ${id} does not exist` });
        }
        await usersService.logUserAction(req.user.userId,"getDepartmentById");
        return res.status(200).json(department);        
    }
    catch(err)
    {
        errlogger.error(`getDepartmentById failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }
}

const addDepartment = async (req,res)=>
{
    try
    {
        const name = req.body.name;
        const managerId = req.body.managerId;
        
        let result = await validator.validateDepartmentInfo(name, managerId);
        if ( result)
        {
            return res.status(result.status).json(result.message);
        }

        const existingDepartment = await departmentsService.getDepartmentByName(name);
        if (existingDepartment)
        {
            return res.status(409).json({ message:`A department with the name: ${name} already exists`});
        }

        const newDepartment = await departmentsService.addDepartment({ name, managerId} );
        await usersService.logUserAction(req.user.userId,"addDepartment");
        return res.status(201).json(newDepartment);
    }
    catch(err)
    {
         errlogger.error(`addDepartment failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }
}

const updateDepartment = async (req,res) =>
{
    try
    {
          const id = req.params.id;
          const deptObj = req.body;

          const result = validator.validateEntityId(id,'Department');
          if (result)
          {
            return res.status(result.status).json(result.message);
          }

          const department = await departmentsService.getDepartmentById(id);
          if (!department)
          {
             return res.status(404).json(`Department with id ${id} does not exist`);
          }

          // flags detecting which fields were provided 
          const nameProvided =   Object.prototype.hasOwnProperty.call(deptObj, 'name');
          const managerIdProvided =  Object.prototype.hasOwnProperty.call(deptObj, 'managerId');

          // to enable partial sending of department data, complete missing fields from current department:
          const name = nameProvided ? deptObj.name:department.name;
          const managerId = managerIdProvided ? deptObj.managerId: department.managerId.toString();

          
          const result2 = await validator.validateDepartmentInfo(name,managerId);
          if ( result2)
          {
              return res.status(result2.status).json(result2.message);
          }
          const updatedDept = await departmentsService.updateDepartment(id,{name,managerId});
          await usersService.logUserAction(req.user.userId,"updateDepartment");
          return res.status(200).json(updatedDept);
    }
    catch(err)
    {
        errlogger.error(`updateDepartment failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }
}


const deleteDepartment = async (req,res) =>
{
    try
    {
        const id = req.params.id;
        const result = validator.validateEntityId(id,'Department');
        if (result)
        {
            return res.status(result.status).json(result.message);
        }
        const exists = await departmentsService.departmentExists(id);
        if (!exists)
        {
            return res.status(404).json(`Department with id ${id} does not exist`);
        }
        // todo: delete department employees 
        const deletedDepartment = await departmentsService.deleteDepartment(id);
        await usersService.logUserAction(req.user.userId,"deleteDepartment");
        return res.status(200).json(deletedDepartment);
    }
    catch(err)
    {
        errlogger.error(`deleteDepartment failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);
    }
}

module.exports = {
    getAllDepartments,
    getDepartmentsNames,
    getDepartmentById,
    getDepartmentEditInfo,
    addDepartment,
    updateDepartment,
    deleteDepartment 
}