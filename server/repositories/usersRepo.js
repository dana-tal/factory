const User = require('../models/userModel');
const { getToday } = require('../utils/dateFuncs');

const getUserById = (userId)=>{
      return User.findById(userId);
}

const getUsersRemainingActions =  () =>{

  
  const today = getToday(); // Date at midnight

 return User.aggregate([
    {
      $lookup: {
        from: 'userActions',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$id'] },
                  { $eq: ['$actionsDate', today] }
                ]
              }
            }
          }
        ],
        as: 'todayAction'
      }
    },

    // get the document of userActions from the array todayAction at index 0 :
    {
      $addFields: {
        todayActionsRecord: { $arrayElemAt: ['$todayAction', 0] }
      }
    },
    {
      $addFields: {
        actionsCountToday: { $ifNull: ['$todayActionsRecord.actionsCount', 0] }
      }
    },
    {
      $addFields: {
        remainingActions: {
          $subtract: ['$maxActions', '$actionsCountToday']
        }
      }
    },
    {
      $project: {
        fullName: 1,
        maxActions: 1,
        remainingActions: 1
      }
    }
  ]);

  
}



module.exports = { getUserById , getUsersRemainingActions };