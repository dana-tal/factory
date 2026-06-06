import { useState } from "react";
import { requestAllShifts } from "../utils/shiftRequest";
import { requestShiftById } from "../utils/shiftRequest";

export const useShiftForm = () =>{

    const [selectedShift, setSelectedShift] = useState(null);
   
   
    const fetchShift = async (id)=>
    {
        try
        {
            const response = await requestShiftById(id);
            setSelectedShift(response);                
        }
        catch(err)
        {
            console.log(err);
        }
    } 

    return { selectedShift,fetchShift};
} 