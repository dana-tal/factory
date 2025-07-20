const mongoose = require('mongoose');
const userActions = require('../models/userActionsModel');
const { getToday } = require('../utils/dateFuncs');


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


const  userReachedActionsLimit = async (userId)=>
 {
    const actionsDate =  getToday();
    const result = await userActions.aggregate([
        {
            $match: {                                             // select only documents of the given userId from tody ....
                userId: new mongoose.Types.ObjectId(userId),
                actionsDate: new Date(actionsDate)
            }
        },
        {
            $lookup: {                                       // add the matching document from the users collection 
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },                             // transform the user field from array to an object 
        {
            $match: {                                    // filter the result based on equality between users.maxActions and userActions.actionsCount 
                $expr: {
                    $eq: ['$actionsCount', '$user.maxActions']
                }
            }
        }
    ]);
        
    // The result is always an array. The array maybe empty in case there is no equality (The user has not reached actions count limit yet )
    return result.length > 0;
}

// this function will always return an array .
// it maybe empty if the user does not have any record for today yet 
const getUserActionsDoc = (userId) =>{

    const today =  getToday();

     return userActions.aggregate([
        {
            $match: {                                             // select only documents of the given userId from tody ....
                userId: new mongoose.Types.ObjectId(userId),
                actionsDate: new Date(today)
            }
        },
        {
            $lookup: {                                       // add the matching document from the users collection 
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' }
     ]);
}

module.exports = {  increaseActionsCounter, decreaseActionsCounter, userReachedActionsLimit ,getUserActionsDoc};
