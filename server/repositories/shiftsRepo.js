
const Shift = require('../models/shiftModel');

const getAllShifts = (filters)=>{
    return Shift.find(filters);
}

const getShiftById = (id)=>{
    return Shift.findById(id);
}

const addNewShift = (shiftObj)=>{

    const shift = new Shift(shiftObj);
    return shift.save();
}

const shiftExists = (startDate,endDate) =>
{
    return Shift.findOne({
            startDate: startDate,
            endDate: endDate
        });
}

const udpateShift = (id, shiftObj) =>
{
    return Shift.findByIdAndUpdate(id,shiftObj,{new:true});
}

module.exports = {
    getAllShifts,
    getShiftById,
    addNewShift,
    shiftExists,
   udpateShift
}