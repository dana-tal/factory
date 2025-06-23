const mongoose = require('mongoose');
const Employee = require('../models/employeeModel');
const Shift = require('../models/shiftModel');
const EmployeeShifts = require('../models/employeeShiftModel');


const getAllEmployees = (filters = {}) => {
  // guard against bad input
  if (typeof filters !== 'object' || filters === null || Array.isArray(filters)) {
    filters = {};
  }

  return Employee.aggregate([
    ...(Object.keys(filters).length ? [{ $match: filters }] : []),

    // 1️⃣ join department (1‑to‑1)
    {
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department'
      }
    },
    { $unwind: '$department' },

    // 2️⃣ junction rows (still an array)
    {
      $lookup: {
        from: 'employeeShifts',
        localField: '_id',
        foreignField: 'employeeId',
        as: 'employeeShifts'
      }
    },

    // 3️⃣ join shifts with explicit $map
    {
      $lookup: {
        from: 'shifts',
        let: {
          shiftIds: {
            $map: { input: '$employeeShifts', as: 'link', in: '$$link.shiftId' }
          }
        },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$shiftIds'] } } },
          { $project: { _id: 1, startDate: 1, endDate: 1 } }
        ],
        as: 'shifts'
      }
    },

    // 4️⃣ keep only wanted fields
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        'department._id': 1,
        'department.name': 1,
        'shifts._id': 1,
        'shifts.startDate': 1,
        'shifts.endDate': 1
      }
    }
  ]);
};


const getEmployeeById = (id)=>{
    return Employee.findById(id).populate({ path:'departmentId', select:'name'});
}

const getEmployeeShifts =  (employeeId) =>{

    const empObjectId = new mongoose.Types.ObjectId(employeeId);
    
    return EmployeeShifts.aggregate([
   
    { $match: { employeeId: empObjectId } },   // 1. Filter to only the given employee
    {                                          // 2. Join with the shifts collection
      $lookup: {
        from: 'shifts',              
        localField: 'shiftId',
        foreignField: '_id',
        as: 'shift'
      }
    },
    { $unwind: '$shift' }, // 3. Since each shift is returned as an array, unwind converts the shift array into a single object so we can work with it directly.   
    { $replaceRoot: { newRoot: '$shift' } },  // 4. Replace the root document with the joined shift document
    { $project: { _id: 1, startDate: 1, endDate: 1 } },  // 5.  select only the fields we want  from shifts  
    { $sort: { startDate: 1 } }  // 6. sort shifts by date

  ]);
  
}

const getEmployeeUnregisteredShifts  =  async (employeeId) =>{

  const empObjectId = new mongoose.Types.ObjectId(employeeId);

    return Shift.aggregate([
        {
          // add a field empReg to each Shift document . if the employee is not registered, an empty arry will be joined 
          $lookup: {
            from: 'employeeShifts',
            let: { shiftId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$shiftId', '$$shiftId'] },
                      { $eq: ['$employeeId', empObjectId] }
                    ]
                  }
                }
              }
            ],
            as: 'empReg'
          }
        },
        { $match: { empReg: { $size: 0 } } },           // filter the resultset, pick only docs where empReg is empty
        { $project: { _id: 1, startDate: 1, endDate: 1 } },
        { $sort: { startDate: 1 } }
      ]);
  };

   



const addNewEmployee = (employeeObj)=>{
    const employee = new Employee(employeeObj);
    return employee.save();
}


const registerEmployeeToShifts = (employeeId, shifts) =>
{  
  const registrationDocs = shifts.map ( shiftId => { return { employeeId, shiftId } });
  return EmployeeShifts.insertMany(registrationDocs, {ordered: false } );  // order false means skip duplicates
} 


const unregisterEmployeeFromShifts = (employeeId, shifts) =>
{
    const empObjectId = new mongoose.Types.ObjectId(employeeId);
    const normalizedShiftIds = shifts.map(id =>new mongoose.Types.ObjectId(id));

    return EmployeeShifts.deleteMany( { employeeId: empObjectId, shiftId: { $in: normalizedShiftIds}});
}


const updateEmployeesDepartment = (employeeIds, newDeptId) =>{
    return Employee.updateMany (
        { _id: { $in: employeeIds } },
        { $set: { departmentId: newDeptId }}
    )
}

const updateEmployee = (id,employeeObj)=>{
    return Employee.findByIdAndUpdate(id,employeeObj,{new:true});
}

const deleteEmployee = (id) =>{
    return Employee.findByIdAndDelete(id);
}

const employeeExists = (id) =>{
    return Employee.exists({ _id: id}); 
}



module.exports = {
    getAllEmployees,
    getEmployeeById,
    addNewEmployee,
    updateEmployeesDepartment,
    updateEmployee,
    deleteEmployee,
    employeeExists,
    registerEmployeeToShifts,
    unregisterEmployeeFromShifts,
    getEmployeeShifts,
    getEmployeeUnregisteredShifts 
}