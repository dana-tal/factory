import { api  } from "./generalFuncs";

const requestAllShifts = async ()=>
{
    const response = await api.get('/shifts');
    return response.data;
}

const requestShiftById = async (shiftId) =>
{
     const response = await api.get('/shifts/editInfo/'+shiftId);
     return response.data;
}



const requestShiftAdd = async (shift_obj) =>{
       const response = await api.post( '/shifts', { ...shift_obj } );
       return response.data;
}

const requestShiftUpdate = async (shift_obj)=>{
     const response = await api.put('/shifts/'+shift_obj.id, { ...shift_obj });
     return response.data;
}



export 
{
    requestAllShifts,
    requestShiftById,
    requestShiftAdd,
    requestShiftUpdate,    
}