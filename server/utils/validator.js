
const mongoose = require('mongoose');
const {isMatch, parse } = require('date-fns');

const employeesService = require('../services/employeesService');
const departmentService = require('../services/departmentsService');
const shiftsService  = require('../services/shiftsService');

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

const isValidDateInput = (inputObj,fieldName,isMandatory) =>{

     let result;
     const ISO_PATTERN = "yyyy-MM-dd'T'HH:mm:ssX"; 
     const dateProvided =  Object.prototype.hasOwnProperty.call(inputObj, fieldName); // the field was present in the request body 

     if (!dateProvided )
     {
          if (isMandatory)
          {
               result = { status:400, message: `${fieldName} is mandatory and is missing from the request`};
          }
          else
          {
               result = {status:'O.K', message:'O.K', dateObj:null};
          }
     }
     if (dateProvided) // the date is present in the request 
     {
          const fieldValue = inputObj[fieldName];
          if ( typeof fieldValue !== 'string')
          {
               result = { status:400, message: `${fieldName} must be a string`};
          }
          else 
          {
               if (!isMatch(fieldValue, ISO_PATTERN)) 
               {
                    result = { status:400, message: `${fieldName} has invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)`};
               }
               else 
               {
                    const fieldDateObj = parse(fieldValue, ISO_PATTERN, new Date(), { strict: true });
                     result = { status:'O.K', message:'O.K', dateObj:fieldDateObj };
               }
          }
     }

     return result;
}

const validateEmployees = async (fieldName, reqBody) =>{
     let i,result;
     
     const employeesProvided =  Object.prototype.hasOwnProperty.call(reqBody, fieldName);
     if (!employeesProvided)
     {
          return { status:400,  message:`${fieldName} field is mandatory. Please provided some employee ids `};
     }
     else
     {
          if ( !Array.isArray(reqBody[fieldName]) )
            {
                 return { status:400 ,message:fieldName+' field should be an array'};
            }
            else if ( reqBody[fieldName].length ===0)
            {
               return { status:400 , message: fieldName+' is an empty array.Please provide some employee ids' };
            }
     }
     const allEmployees = reqBody[fieldName]; 
     let employee, employeeExists;

      for(i=0; i< allEmployees.length; i++)
     {
          employee = allEmployees[i];
          result = validateEntityId(employee,'Employee');
          if (result)
          {
               return result ;
          }
          employeeExists = await employeesService.employeeExists(employee);
          if (!employeeExists)
          {
                result = { status:404 ,message:`The employee id:${employee} supplied does not exist` }; 
                return result;
          }
     }    
     return {status:'O.K', message:'O.K'};
}

const validateShifts = async (fieldName,reqBody)=>{

     let i,result;

       const shiftsProvided =  Object.prototype.hasOwnProperty.call(reqBody, fieldName);
       if (!shiftsProvided)
        {
           return { status:400,  message:`${fieldName} field is mandatory. Please provided some shifts ids `};
        }
        else
        {
            if ( !Array.isArray(reqBody[fieldName]) )
            {
                 return { status:400 ,message:fieldName+' field should be an array'};
            }
            else if ( reqBody[fieldName].length ===0)
            {
               return { status:400 , message: fieldName+' is an empty array.Please provide some shift ids' };
            }
        }

     const allShifts = reqBody[fieldName]; 
     let shift, shiftExist;

     for(i=0; i< allShifts.length; i++)
     {
          shift = allShifts[i];
          result = validateEntityId(shift,'Shift');
          if (result)
          {
               return result ;
          }
          shiftExist = await shiftsService.shiftExists(shift);
          if (!shiftExist)
          {
                result = { status:404 ,message:`The shift id:${shift} supplied does not exist` }; 
                return result;
          }
     }    
     return {status:'O.K', message:'O.K'};
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


const validateShiftInfo = async (startDate,endDate)=>
{

     let result = null;

     const now = Date();

     if (now > startDate ) // startDate is in the past 
     {
          result = { status:422, message:'startDate is in the past'};
     }
     else if (startDate > endDate || startDate.getTime() === endDate.getTime() )
     {
          result = { status:422, message:`startDate and endDate are equal or startDate is latter than endDate `};
     }

     return result ;
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
             result = { status:404 ,message:'The department id supplied does not exist' };
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
      const manager = await employeesService.employeeExists(managerId);
      if (!manager)
      {
           result = { status:404 ,message:'The manager id supplied does not exist' };
      }
   }
   return result;
}

module.exports = {
    isValidMongoId,
    isValidDateInput,
    validateDepartmentInfo,
    validateEntityId,
    validatePersonName,
    validateEmployeeInfo,
   validateShiftInfo,
   validateShifts,
   validateEmployees
};