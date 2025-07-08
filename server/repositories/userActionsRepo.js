const userActions = require('../models/userActionsModel');


const getToday = () => {

    let now = new Date();
    let todayUtcMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
    0, 0, 0, 0
    ));
    return todayUtcMidnight;
}


/* The following function will update the user actions counter */
/* only if he is still under the limit */
/* if the user already reached the limit, it will not update */
/*  and return null */
/* The function knows how to handle a situation where the user */
/* does not have a record for today. In this case it will take */
/* the values of userId, actionDate from the first section */
/* and actionsCount will be set to 1 (from the $inc part)  */

const increaseActionsCounter = async (userId,maxActions) =>
{
    let today = getToday();

    // Try to increment only if actionsCount is below max
    const updated = await userActions.findOneAndUpdate(
        {
            userId: userId,
            actionsDate: today,
            actionsCount: { $lt: maxActions }
        },
        {
            $inc: { actionsCount: 1 }
        },
        {
            new: true // return the updated document
        }
    );

    // If found and updated, return
    if (updated) 
        return updated;

    // If not found — check if document exists
    const existing = await userActions.findOne({ userId: userId, actionsDate: today });

    if (!existing) {
        // No document exists — safe to insert
        return await userActions.create({
            userId: userId,
            actionsDate: today,
            actionsCount: 1
        });
    }

    // If document exists and we couldn't update — limit reached
    return null;
   
}


/* in case  a request failed, we want to "rollback" the user actions counter */
/* because the user actions counter is increased before the request is       */
/* actually being served (to avoid concurrency problems)                     */
/* so there is a slight chance, we increased the user actions counter        */
/* with no justification for this increase. The following function purpose   */
/*  is to fix these situations                                               */

const decreaseActionsCounter = (userId) =>{
 
    let today = getToday();
    
    return userActions.findOneAndUpdate(
        {
            userId,
            actionsDate: today, // date with time set to 00:00
            actionsCount: { $gt: 0 } // only if the user actions counter is higher than zero
        },
        {
            $inc: { actionsCount: -1 } // increment the counter by 1
        },
        {
            new: true,       // return the updated document
            upsert: false     // do not create a new document, if one does not exist yet 
        }
    );
}

module.exports = {  increaseActionsCounter, decreaseActionsCounter };
