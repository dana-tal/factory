import { useState } from "react";
import { requestShiftAdd, requestShiftUpdate,requestAllShifts } from "../utils/shiftRequest";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useEntities } from "./useEntities";

export const useShifts = () =>{

    const [loadingShifts, setLoadingShifts] = useState(false); 
    const [rows, setRows] = useState([]);      // will hold a row for each department 
    
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const isMobile = useMediaQuery('(max-width:480px)');
    const paginationModel = { page: 0, pageSize: 10 };
 
    const navigate = useNavigate();

    const { handleEntityAdd,handleEntityUpdate} = useEntities({setRows,setFeedbackMsg,requestAddCallback:requestShiftAdd,
                                                  requestRemoveCallback:()=>{} ,requestUpdateCallback:requestShiftUpdate,
                                                  entity_name:"shift" });

    const fetchShifts = async ()=>
    {
          setLoadingShifts(true);
          const allShifts =  await requestAllShifts();
          setRows(allShifts);       
          setLoadingShifts(false);         
    }                                                
    

      const handleNewShift = ()=>{
        navigate("/shifts/add");
    }

   
    const showErrorMsg =  (msg)=>{
        setErrorMsg(msg);
         setTimeout(() => {
                    setErrorMsg("");
                    }, 4000);
     }

    const handleShiftAdd = (shift_obj,setError) => 
    {
        return handleEntityAdd(shift_obj,setError);
    };


    const handleShiftUpdate = async (shift_Obj, setError) =>{
        return handleEntityUpdate(shift_Obj,setError );
    }

    
    return { loadingShifts,rows,fetchShifts,paginationModel,isMobile,handleNewShift,
            feedbackMsg,errorMsg ,handleShiftAdd, handleShiftUpdate};
}
