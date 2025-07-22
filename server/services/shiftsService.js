
const shiftsRepo = require('../repositories/shiftsRepo');


const getAllShifts = ()=>{
    return shiftsRepo.getAllShifts();
}

const getShiftById = async (id)=>{
    const shiftObj = await shiftsRepo.getShiftById(id);
    const shiftEmployees = await shiftsRepo.getShiftEmployees(id);
    const result = { ...shiftObj._doc, registeredEmployees: shiftEmployees };
    return result;
}

const getShiftEditInfo = async (id) =>{
    const shiftObj = await shiftsRepo.getShiftById(id);
    const shiftEmployees = await shiftsRepo.getShiftEmployees(id);
    const unregisteredEmployees = await shiftsRepo.getUnregisteredEmployees(id);
    const result = { ...shiftObj._doc, registeredEmployees: shiftEmployees, unregisteredEmployees};
    return result;
}

const addNewShift = (shiftObj) =>{
    return shiftsRepo.addNewShift(shiftObj);
}

const shiftExists = (id) =>{
    return shiftsRepo.shiftExists(id);
}

const updateShift = (id,shiftObj) =>{
    return shiftsRepo.udpateShift(id,shiftObj);
}

const registerEmployeesToShift = (shiftId,employeeIds) =>
{
    return shiftsRepo.registerEmployeesToShift(shiftId,employeeIds);
}

const unregisterEmployeesFromShift = (shiftId, employeeIds) =>
{
    return shiftsRepo.unregisterEmployeesFromShift(shiftId, employeeIds);
}

module.exports = {
    getAllShifts,
    getShiftById,
    getShiftEditInfo,
    addNewShift,
    shiftExists,
    updateShift,
    registerEmployeesToShift,
    unregisterEmployeesFromShift
}