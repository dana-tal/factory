
// this middleware will check the user actions counter. If the user 
// has reached the maximum counter value , it will log him out 

const authController = require('../controllers/authController');
const usersService  = require('../services/usersService');
const errlogger = require('../utils/logger');

const limitDailyActions = async (req,res,next) =>{
   
    try
    {
        const userId = req.user.userId; // this is ensured by previous middleware - verifyToken.js 
        const userActions = await usersService.increaseUserActionsCounter(userId);
        if (!userActions) {
            req._logoutReason = 'dailyLimit';
            return authController.doLogout(req, res, 403);
        }

         // Attach a listener to decrease the counter if the request ends with an error status
        res.on('finish', async () => {
            if (res.statusCode >= 400) {
                try {
                    const decreaseInfo = await usersService.decreaseUserActionsCounter(userId);                    
                } catch (err) {
                     errlogger.error(`Failed to decrease actions counter for user ${userId}: ${err.message}`, { stack: err.stack });
                }
            }
        });

        next();
    }
    catch(err)
    {
        errlogger.error(`limitDailyActions failed: ${err.message}`, { stack: err.stack });
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

module.exports = { limitDailyActions };