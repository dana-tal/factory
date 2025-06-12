
const shiftsRepo = require('../repositories/shiftsRepo');


const getAllShifts = ()=>{
    return shiftsRepo.getAllShifts();
}

const getShiftById = (id)=>{
    return shiftsRepo.getShiftById(id);
}

const addNewShift = (shiftObj) =>{
    return shiftsRepo.addNewShift(shiftObj);
}

const shiftExists = (startShift, endShift) =>{
    return shiftsRepo.shiftExists(startShift,endShift);
}

const updateShift = (id,shiftObj) =>{
    return shiftsRepo.udpateShift(id,shiftObj);
}

module.exports = {
    getAllShifts,
    getShiftById,
    addNewShift,
    shiftExists,
    updateShift
}