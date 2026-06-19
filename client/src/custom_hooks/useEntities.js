import { capitalize } from "../utils/generalFuncs";


export const useEntities = ({ setRows,setFeedbackMsg,requestAddCallback,requestRemoveCallback,requestUpdateCallback,entity_name })=>{

    const catchHandler = (err,action_name, setError)=>
    {
        if (err.cancelled) // prevent further execution in case the system performed automatic logout (dailyLimit reached)
        {
            return;
        }
        console.log("Status:", err.response?.status);
        console.log("Data:", err.response?.data);
        console.log("Message:", err.response?.data?.message || err.message);

        if (setError)
        {
            setError("root", {
                    type: "manual",
                    message: err.response?.data?.message || err.message || action_name+" "+entity_name+" failed"
                });
        }

    }

    
    const showFeedback =  (msg)=>{
             setFeedbackMsg(msg);
               setTimeout(() => {
                    setFeedbackMsg("");
                    }, 4000);
    }
    
    const handleEntityAdd = async (entity_obj, setError)=>
    {
        try
        {
            const new_entity = await requestAddCallback(entity_obj);
            setRows( (prevRows)=>{  return [ ...prevRows, new_entity] } );               
            return true;          
        }
        catch(err)
        {
            catchHandler(err,"Adding",setError);
            return false;
        }   
    }

    const handleRemoveMany  = async (ids)=>{
        try
        { 
            const res = await requestRemoveCallback(ids);  
            setRows( (prevRows)=> {  
                       let temp = [ ...prevRows];
                       const updatedRows  =  temp.filter( entity => { return !ids.includes(entity.id) } )
                       return updatedRows;
             });
            showFeedback(`${capitalize(entity_name)}(s) removed successfully`);  
        }
        catch(err)
        {
            catchHandler(err,"Removing")
        }
    }

    const handleEntityUpdate = async (entity_obj, setError) =>
    {
        try
        {
            const updatedEntity = await requestUpdateCallback(entity_obj);
            setRows( (prevRows)=>{  
                let temp = [...prevRows]; 
                let updated = temp.map( (entity)=>{ if (entity.id=== updatedEntity.id){ return updatedEntity } else { return entity }  } );
                return updated;
            });
            return true;  
        }
        catch(err)
        {
            catchHandler(err,"Updating",setError);
            return false;
        }
    }

   
    return { handleEntityAdd,handleRemoveMany,handleEntityUpdate }

}