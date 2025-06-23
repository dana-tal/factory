const factoryConfig = require('../configs/factoryConfig');
const employeeRepo = require('../repositories/employeesRepo');
const shiftRepo = require('../repositories/shiftsRepo');

const getAllEmployees = async (filters)=>{
    
    const employees = await employeeRepo.getAllEmployees(filters);
    return employees;

}
const getEmployeeById = async (id)=>{
    const temployee = await employeeRepo.getEmployeeById(id);
    let employee = null;
    
    if (temployee)
    {    
         employee = {
                        ... temployee._doc,
                        department:
                        {
                            id: temployee.departmentId._id.toString(),
                            name: temployee.departmentId.name
                        }
                    }
         delete employee.departmentId;    
         
         
         const empShifts = await employeeRepo.getEmployeeShifts(id);

         const empUnregisteredShifts = await employeeRepo.getEmployeeUnregisteredShifts(id);



         employee.shifts = empShifts;
         employee.unregisteredShifts = empUnregisteredShifts;
      
    }

    return employee;
}

const detectOverlappingShifts = (empExistingShifts, newShiftsDocs) =>
{
    const accepted = [];
    const acceptedIds    = [];   // strings for the result
    const rejectedIds    = [];
    let i = 0; // pointer into empExistingShifts[]
    let overlap; // boolean flag for indicating there is an overlap 

    //  Sort both lists by startDate 
    const byStart = (a, b) => a.startDate - b.startDate;
    newShiftsDocs.sort(byStart);
    empExistingShifts.sort(byStart);


    for (const ns of newShiftsDocs)  // repeat for every new shift 
    {
        // Skip existing shifts that ended before the new shift starts
        while (i < empExistingShifts.length && empExistingShifts[i].endDate <= ns.startDate) 
        {
            i++;
        }

        // Check overlap with current existing shift
        overlap = false;
        if (i < empExistingShifts.length && ns.startDate < empExistingShifts[i].endDate && ns.endDate > empExistingShifts[i].startDate) 
        {
            overlap = true; // since empExistingShifts is sorted, we need not check further, because the rest of the shifts start even later than the tested one
        }

        // Also check overlap with already accepted new shifts, again, thanks to sorting, no need to check for more than the last accepted item
        if (!overlap && accepted.length > 0) 
        {
            const last = accepted[accepted.length - 1];
            if (ns.startDate < last.endDate && ns.endDate > last.startDate) 
            {
                overlap = true;
            }
        }

        if (overlap)
        {
            rejectedIds.push(ns._id.toString());
        }
        else 
        {
            accepted.push(ns);                 // keep the object for later checks
            acceptedIds.push(ns._id.toString());
        }
    } // end of for loop

    const output = { rejected:rejectedIds, accepted:acceptedIds};

    return output;
}


const registerEmployeeToShifts = async (empId,newShiftIds) =>{

    const empExistingShifts = await employeeRepo.getEmployeeShifts(empId);

    const empExistingShiftIds  = empExistingShifts.map( shift =>{  return shift._id.toString() });

    const allreadyRegistered = [];
    const shiftsSet = [];

    let i, testedShiftId;
    

    // keep only shift ids that the employee is not registered to , put them in shiftsSet 
    for (i=0; i< newShiftIds.length; i++)
    {
        testedShiftId = newShiftIds[i];
        if (empExistingShiftIds.includes(testedShiftId))
        {
            allreadyRegistered.push(testedShiftId);
        }
        else
        {
            shiftsSet.push(testedShiftId);
        }
    }

    // define the output structure 
    let result = {
        'allreadyRegistered': allreadyRegistered,
        'registeredSuccessfully':[],
        'overlapped':[]
    };

    if ( shiftsSet.length >0) // if there are new shifts left that are not allready associated with the employee ...
    {
        const newShiftsDocs = await shiftRepo.getShiftsByIds(shiftsSet); // get the entire docs according to the new shifts' ids

        let accepted = [];
        
        if ( factoryConfig.allowOverlappingShifts) // if we allow overlapping shifts, we need not filter any further
        {
            accepted = shiftsSet;
        }
        else // check for overlapping shifts :
        {
            const output = detectOverlappingShifts(empExistingShifts, newShiftsDocs);  
            result['overlapped']= output.rejected;
            accepted = output.accepted;
        }
            
        if (accepted.length > 0 )
        {
            info = await employeeRepo.registerEmployeeToShifts(empId, accepted );     
             result['registeredSuccessfully'] = accepted;  
        }

    } 
    return result ;
}

const unregisterEmployeeFromShifts = async ( empId, removeShiftIds) =>
{
    return employeeRepo.unregisterEmployeeFromShifts (empId, removeShiftIds);
}

const addNewEmployee = (employeeObj)=>{
    return employeeRepo.addNewEmployee(employeeObj);
}


const updateEmployee = (id, employeeObj)=>{
    return employeeRepo.updateEmployee(id,employeeObj);
}

const deleteEmployee = (id)=>{
    return employeeRepo.deleteEmployee(id);
}

const employeeExists = (id) =>{
    return employeeRepo.employeeExists(id);
}

module.exports ={
    getAllEmployees,
    getEmployeeById,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    employeeExists,
    registerEmployeeToShifts,
    unregisterEmployeeFromShifts 
}