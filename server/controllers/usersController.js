const usersService = require('../services/usersService');
const errlogger = require('../utils/logger');


const getAllUsers = async (req,res,next) =>{

    try
    {
        const allUsers = await usersService.getUsersActions();
        await usersService.logUserAction(req.user.userId,"getAllUsers");
        return res.status(200).json(allUsers);   
    }
    catch(err)
    {
        errlogger.error(`getAllUsers failed: ${err.message}`, { stack: err.stack });
        return next(err);         
    }
}

module.exports = { getAllUsers };