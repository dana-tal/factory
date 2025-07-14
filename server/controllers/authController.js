const errlogger = require('../utils/logger');

const axios = require('axios');
const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');


const turnApiIdToObjectId = (id) =>{

    let id_str;
    const my_id_num = +id;

    const ids_base = "0010000000000000000000";
   
    id_str = my_id_num < 10 ? ids_base+'0'+id : ids_base+id;
    return (id_str); 
}

const verifyApiUser = async (username,email)=>{
    
    const result = { isVerified:false, id:0, username,email};
    const {data: users} = await axios.get(process.env.USERS_URL);
    const user = users.find( (user)=> { return user.username===username && user.email===email });
    
    if (user!==null && user !== undefined)
    {
        result.isVerified = true;
        result.id = user.id;   // this is the id coming from the api (1,2,3 ,... etc)
        result.userId = turnApiIdToObjectId(user.id); // the userId is the id used in the users collection 
        result.name = user.name;
    }
    return result;
}


const login = async (req,res) =>{

    const { username, email } = req.body;
      
    try
    {
        const result = await verifyApiUser(username,email);
        if (result.isVerified)
        {
            // check if the user has reached actions count limit .....
                const reachedLimit = await  usersService.userReachedActionsLimit(result.userId);
                if (reachedLimit )
                {
                   return  res.status(403).json({ message: 'Maximum number of actions reached. Login is not allowed today, please try again tommorow.' });
                }

                const payload = { id: result.id, userId: result.userId ,username: result.username , email: result.email ,name: result.name};    
                // protect against session fixation ( prevent an attaker from supplying his sessionId to inoceent users )
                req.session.regenerate(err => 
                                            {
                                                if (err)
                                                {
                                                    errlogger.error(`Session regenerate failed: ${err.message}`);
                                                    return res.status(500).json({ message: 'Session regenerate failed' });
                                                }   
                                                req.session.token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN }); // saving the token inside the session 
                                                res.status(200).json({ message:'logged in successfully', name: result.name });  
                                            });      
                     
        }
        else
        {
                return res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch(err)
    {
        errlogger.error(`login failed: ${err.message}`, { stack: err.stack });
        return res.status(500).json(err);  
    }
}


const logout = (req,res) =>{
     doLogout(req,res,200);
}

const doLogout = (req, res, statusCode=200) => {

  req.session.destroy((err) => 
  {
    if (err) 
    {
      console.error('Failed to destroy session:', err);
      return res.status(500).json(err);
    }

    res.clearCookie('FactorySessionId');
    res.status(statusCode).json({ 
                            message: req._logoutReason === 'dailyLimit' ? "You have reached your daily limit and have been logged out.":"Logged out",
                            action: "logout",
                            redirectTo: "/login"
                        });   
  });
}

module.exports = { login, logout, doLogout};