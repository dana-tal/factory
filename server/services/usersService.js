
const usersRepo = require('../repositories/usersRepo');
const userActionsRepo = require('../repositories/userActionsRepo');

const increaseUserActionsCounter = async (userId) =>{

   const user = await usersRepo.getUserById(userId);
   const userActions = await userActionsRepo.increaseActionsCounter(userId,user.maxActions);
   return userActions;
}

const decreaseUserActionsCounter = (userId) =>{
     return userActionsRepo.decreaseActionsCounter(userId);
}


module.exports = { increaseUserActionsCounter, decreaseUserActionsCounter }