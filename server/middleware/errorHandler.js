
const usersService = require('../services/usersService');

const errorHandler = async (err, req, res, next) => {
//console.log("reached errorHandler");

    if (res.headersSent) {
        return next(err);
    }

    try {
        if (res.locals.userId) {
            const updated = await usersService.decreaseUserActionsCounter(res.locals.userId);
            res.locals.actionsCount = updated.actionsCount;
          //  console.log("actionsCount:",   res.locals.actionsCount);
        }
    } catch (e) {
        console.error('rollback failed', e);
    }

    res.status(err.status || 500);

    return res.json({
        message: err.message || 'Internal Server Error'
    });
};

module.exports = { errorHandler };