
// this middleware will check the user actions counter. If the user 
// has reached the maximum counter value , it will not let him
// perform any request 

const usersService  = require('../services/usersService');

const limitDailyActions = async (req,res,next) =>{
   
    const userActions = await usersService.increaseUserActionsCounter(req.user.userId);
    if (!userActions)
    {
        console.log("user has reached the maximum actions allowed ");
             // this is a temporary code, will later be replaced with user.logout service  or userController logout 
            res.status(403).json({ 
            message: "Logged out due to daily limit",
            action: "logout",
            redirectTo: "/login"
        });
    }
    else
    {
        next();
    }
    
}

module.exports = { limitDailyActions };