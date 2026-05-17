import { Button } from "@mui/material";
import { getButtonFontSize } from '../utils/styleFuncs';
import { useState,useEffect } from "react";

function CustomButton({ clickHandler, bgColor="#488AC7", textColor="white",textTransform="capitalize" ,label}) 
{      
    const [buttonFontSize, setButtonFontSize] = useState(getButtonFontSize());

    useEffect(() => {
                  const update = () => { setButtonFontSize(getButtonFontSize()) };
                  window.addEventListener("resize", update);
                  return () => window.removeEventListener("resize", update);
              }, []);
   

  return (
     <Button onClick={clickHandler} size="small"  sx={{ backgroundColor:bgColor,textTransform:textTransform ,color:textColor, marginLeft:"10px", fontSize:`${buttonFontSize} !important` }}>{label}</Button>
  )
}

export default CustomButton