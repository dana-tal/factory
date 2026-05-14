import { api  } from "./generalFuncs";


const sendLoginData = async ( data_obj) =>{

  const response = await api.post('/auth/login', { username: data_obj.username, email: data_obj.email});
  return response.data;
  
}

const requestLogout = async () =>{
   
   const response = await api.post('/auth/logout',{});
     return response.data;  
}




export {
    sendLoginData,
    requestLogout,    
}