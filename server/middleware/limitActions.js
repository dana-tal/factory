
// this middleware will check the user actions counter. If the user 
// has reached the maximum counter value , it will log him out 

//const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const usersService  = require('../services/usersService');

const limitDailyActions = async (req,res,next) =>{
   
    const userActions = await usersService.increaseUserActionsCounter(req.user.userId);
    if (!userActions) // the user has reached his maximum value of allowed actions 
    {
            req._logoutReason = 'dailyLimit';
            return authController.logout(req, res, 403);           
    }    
    next();    
}

module.exports = { limitDailyActions };