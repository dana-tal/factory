
const usersRepo = require('../repositories/usersRepo');
const userActionsRepo = require('../repositories/userActionsRepo');
const actionsLogger = require('../utils/actionsLogger');

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


const convertDate=(isoDate)=>{

         const date = new Date(isoDate);
         const day = String(date.getUTCDate()).padStart(2, '0');
         const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
         const year = date.getUTCFullYear();
         const formatted = `${day}/${month}/${year}`;
         return formatted;
}

const logUserAction = async (userId,action) => {

   let summary = {};
   let last_chars ,id_str;
   const result = await userActionsRepo.getUserActionsDoc(userId);
   let  isLogged = false;
   if ( result.length >0)
   {
       
      // turn mongoDB id to the jsonplaceholder id 
       const userActionsObj = result[0];
       id_str = userActionsObj.userId.toString();
       last_chars = id_str.slice(-2);
       summary.userId = +last_chars < 10 ? id_str.slice(-1): last_chars;
       summary.actionName = action;
       summary.maxActions = userActionsObj.user.maxActions;
       summary.date = convertDate(userActionsObj.actionsDate);
       summary.currentActionsCount = userActionsObj.actionsCount;
       const log_row = JSON.stringify(summary);
       actionsLogger.info(log_row);
       isLogged = true;
   }
   return(isLogged);
}

module.exports = { increaseUserActionsCounter, decreaseUserActionsCounter ,userReachedActionsLimit,logUserAction }