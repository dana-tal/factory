
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

const userReachedActionsLimit =  async (userId) =>{

   const reachedLimit =  await userActionsRepo.userReachedActionsLimit(userId);
   return reachedLimit;

}

module.exports = { increaseUserActionsCounter, decreaseUserActionsCounter ,userReachedActionsLimit }