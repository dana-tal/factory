const Department = require('../models/departmentModel');
const Employee = require('../models/employeeModel');
const EmployeeShifts = require('../models/employeeShiftModel');
const mongoose = require('mongoose');

const getAllDepartmentsNames= ()=>{
    return Department.find().select('_id name ');
}

const getAllDepartments = (filters)=>{
    return Department.find(filters)
    .populate({ 
        path:'manager',
        select:'_id firstName lastName'
    })
    .populate({
        path: 'employees',
        select: '_id firstName lastName -departmentId' 
    });
}

const getDepartmentById = (id) =>{
    return Department.findById(id)
     .populate({ 
        path:'manager',
        select:'_id firstName lastName'
    })
    .populate({
        path: 'employees',
        select: '_id firstName lastName -departmentId' 
    });
}

const getDepartmentByName = (inputName)=>{
     return Department.findOne({name:inputName});
}

const addDepartment = (deptObj)=>{
       const department = new Department(deptObj);
       return department.save();
}

const updateDepartment = async (id,deptObj)=>{
    const dept = await Department.findByIdAndUpdate(id,deptObj,{new:true}); // setting flag new to true so it will return the updated object 
    return dept.populate('manager');
}

const deleteDepartment = async (id) =>{
    const session = await mongoose.startSession();
    let employeeIds = [];

    try 
    {
        await session.withTransaction(async () => {
                  const employees = await Employee.find({ departmentId: id }, { _id: 1 }).session(session); // will return an array of objects, each containing an _id field
                   employeeIds = employees.map(e => e._id); // will turn it to an array of just ids 

                   await EmployeeShifts.deleteMany({ employeeId: { $in: employeeIds } }).session(session); // remove the shifts registrations of the department employees
                   await Employee.deleteMany({ _id: { $in: employeeIds } }).session(session); // remove the department employees 
                   await Department.deleteOne({ _id: id }).session(session);

            });
            return {
                        deletedDepartmentId: id,
                        employeeIds: employeeIds,
                        employeesDeletedCount: employeeIds.length
                };
    }
    catch (err) 
    {
        console.error('Transaction aborted:', err);
        throw err;
    } 
    finally 
    {
        session.endSession();
    }

}

const departmentExists = (id) =>{
    return Department.exists({ _id: id}); 
}

module.exports = {
    getAllDepartments,
    getDepartmentById,
    addDepartment,
    getDepartmentByName,
    getAllDepartmentsNames,
    updateDepartment,
    deleteDepartment,
    departmentExists
}