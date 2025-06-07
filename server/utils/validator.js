
const mongoose = require('mongoose');
const employeesService = require('../services/employeesService');

const isValidMongoId = (id) => {
  return (
    typeof id === 'string' &&
    id.match(/^[a-fA-F0-9]{24}$/) && // Matches actual 24-char hex ObjectId
    mongoose.Types.ObjectId.isValid(id)
  );
};

const validateDepartmentId =  (id) =>{
     let result = null;

     if (!id || !isValidMongoId(id))
     {
          result = { status:400 , message: 'Department id missing or has invalid type' }; 
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
    validateDepartmentId 
};