
const Shift = require('../models/shiftModel');
const mongoose = require('mongoose');
const EmployeeShift = require('../models/employeeShiftModel');
const Employee = require('../models/employeeModel');


const getAllShifts = (filters)=>{
    return Shift.find(filters).select('startDate endDate');
}

const getShiftById = (id)=>{
    return Shift.findById(id).select('startDate endDate');
}

const getShiftEmployees = (id) =>{

      const shiftObjectId = new mongoose.Types.ObjectId(id);
      
    return EmployeeShift.aggregate([
            { $match: { shiftId: shiftObjectId } },   
            {                                          // 2. Join with the employee collection
                $lookup: {
                    from: 'employees',              
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employee'
                }
            },     
            { $unwind: '$employee' }, // 3. Since each employee is returned as an array, unwind converts the employee array into a single object so we can work with it directly.   
            { $replaceRoot: { newRoot: '$employee' } },  // 4. Replace the root document with the joined employee document
            { $project: { _id: 1, firstName: 1, lastName: 1 } },  // 5.  select only the fields we want  from employees   
    ]);
}


const getUnregisteredEmployees = async (id) =>{

      const employeeIdsInShift = await EmployeeShift.find({ shiftId:id }).distinct('employeeId'); // this gives us an array with employee ids that are registered to the shift
      const unregisteredEmployees = await Employee.find({ _id: { $nin: employeeIdsInShift }}).select('firstName lastName'); // get the employee ids that are not included in employeeIdsInShift
      return unregisteredEmployees;
}


const getShiftsByIds = (ids) =>{
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    return Shift.find({_id:{ $in: objectIds}});
}

/* This function is for bulk insertion. Given a certain shiftId and an array of employeeIds as strings */
const registerEmployeesToShift = async (shiftId, employeeIds) => {
  const shiftObjectId = new mongoose.Types.ObjectId(shiftId);
  const employeeObjectIds = employeeIds.map(id => new mongoose.Types.ObjectId(id));

  // Find already assigned employees for this shift
  const existingAssignments = await EmployeeShift.find({
    shiftId: shiftObjectId,
    employeeId: { $in: employeeObjectIds }
  }).select('employeeId');

  const existingIdsSet = new Set(existingAssignments.map(doc => doc.employeeId.toString()));

  // Filter out employees that are already assigned
  const newAssignments = employeeObjectIds
    .filter(id => !existingIdsSet.has(id.toString()))
    .map(employeeId => ({
      shiftId: shiftObjectId,
      employeeId,
    }));

  if (newAssignments.length === 0) {
    return { insertedCount: 0, skippedCount: employeeIds.length };
  }

  // Insert only new assignments
  const insertedDocs = await EmployeeShift.insertMany(newAssignments);

  return {
    insertedCount: insertedDocs.length,
    skippedCount: employeeIds.length - insertedDocs.length,
  };
};

const unregisterEmployeesFromShift = (shiftId, employeeIds) =>{

    const shiftIdObj = new mongoose.Types.ObjectId(shiftId);
    const employeeObjectIds = employeeIds.map(id => new mongoose.Types.ObjectId(id));

    return EmployeeShift.deleteMany({
        shiftId: shiftIdObj,
        employeeId: { $in: employeeObjectIds }
    });
   
}

const addNewShift = (shiftObj)=>{

    const shift = new Shift(shiftObj);
    return shift.save();
}

const shiftExists = (id) =>
{
    return Shift.exists({_id: id});
}



const udpateShift = (id, shiftObj) =>
{
    return Shift.findByIdAndUpdate(id,shiftObj,{new:true});
}

module.exports = {
    getAllShifts,
    getShiftById,
    getShiftEmployees,
    getUnregisteredEmployees,
    getShiftsByIds,
    registerEmployeesToShift,
    unregisterEmployeesFromShift,
    addNewShift,
    shiftExists,
   udpateShift
}