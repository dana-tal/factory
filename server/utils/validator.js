
const mongoose = require('mongoose');
const employeesService = require('../services/employeesService');
const departmentService = require('../services/departmentsService');

const isValidMongoId = (id) => {
  return (
    typeof id === 'string' &&
    id.match(/^[a-fA-F0-9]{24}$/) && // Matches actual 24-char hex ObjectId
    mongoose.Types.ObjectId.isValid(id)
  );
};

const validateEntityId =  (id, entityName) =>{
     let result = null;

     if (!id || !isValidMongoId(id))
     {
          result = { status:400 , message: entityName+' id missing or has invalid type' }; 
     }
     return result;
}

const validatePersonName = (name,nameType,entity='Employee')=>{

     let result = null;

  
     if (!name|| typeof name !== 'string' )
     {
            result = { status: 400, message: `${entity} ${nameType} is missing or has invalid type`};
     }
     else if ( name.trim().length ===0 || name.match(/^[\-\s]+$/) )
     {
          result = { status: 400, message: `${entity} ${nameType} must contain at least one letter`}; 
     }
     else if ( ! name.match(/^[a-zA-Z\s\-]+$/) )
     {
          result = { status:400, message: `${entity} ${nameType} is invalid. Only letters, spaces, and hyphens are allowed.`};
     }
     return result;
}


const validateEmployeeInfo = async (firstName,lastName,startYear,departmentId)=>
{
     let result = null;
     const names = [ {name:firstName,type:'firstName'}, {name:lastName, type:'lastName'}];
     const d = new Date();
     const currentYear = d.getFullYear();
     const minimalStartYear = currentYear - 70;

     for ( let i=0; i< names.length;i++)
     {
          result = validatePersonName( names[i].name, names[i].type);
          if (result)
          {
               return result;
          }
     }
   

     if  (!startYear || !Number.isInteger(startYear) || startYear<0 )
     {
          result = { status:400, message:'Employee start year is missing or negative or has invalid type '};
          return result;
     }
     else if (startYear < 1950 || startYear > currentYear )
     {
          result = { status:422, message:`Employee start year must be between ${minimalStartYear} and ${currentYear}`};
          return result;
     }
     result = validateEntityId(departmentId,'Department');
     if (result)
     {
          return result;
     }
     const departmentExists = await departmentService.departmentExists(departmentId);
     if (!departmentExists)
     {
             result = { status:422 ,message:'The department id supplied does not exist' };
     }
     return result;
}

const validateDepartmentInfo = async (name,managerId) =>{

   let result = null;

   if (!name|| typeof name !== 'string' )
   {
       result = { status: 400, message: 'Department name missing or has invalid type'};
   }
   else if (  !managerId || !isValidMongoId(managerId) )
   {
        result = { status:400 , message: 'Department managerId missing or has invalid type' };
   }
   else if (  name.trim().length < 2 || name.length > 100) 
   {
        result = { status:422 , message:  'Invalid department name (2–100 characters required)'  }
   }
   else 
   {
      const manager = await employeesService.getEmployeeById(managerId);
      if (!manager)
      {
           result = { status:422 ,message:'The manager id supplied does not exist' };
      }
   }
   return result;
}

module.exports = {
    isValidMongoId,
    validateDepartmentInfo,
    validateEntityId,
    validatePersonName,
    validateEmployeeInfo
};