const usersService = require('../services/usersService');

// this is a re-write of res.json 

const attachResponse = (req, res, next) => {

  //  console.log('attachResponse middleware entered');
    const originalJson = res.json.bind(res);

    res.json = (data) => {
    // console.log('res.json override called');
    if (!res.locals.userId) {
            return originalJson(data);
    }
 
    res.set(
            'X-Remaining-Actions',
            String(res.locals.maxActions - res.locals.actionsCount)
        );
  
    return originalJson(data);
};

    next();
};

module.exports = { attachResponse };