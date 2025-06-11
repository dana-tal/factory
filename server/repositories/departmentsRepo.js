const Department = require('../models/departmentModel');

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

const deleteDepartment = (id) =>{
    return Department.findByIdAndDelete(id);
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