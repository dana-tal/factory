const User = require('../models/userModel');

const getUserById = (userId)=>{
      return User.findById(userId);
}

const getUsersActions = () =>{

      return User.aggregate( [
            {
                  $lookup:{
                        from:'userActions',
                        localField:'_id',
                        foreignField:'userId',
                        as: 'userActions'
                  },

            },
            { $unwind: '$userActions' },
            {
            $match: {                                    // filter the result based on equality between users.maxActions and userActions.actionsCount 
                $expr: {
                    $eq: [, '$userActions.actionsDate']
                }
            }
        }
      ]);

}

/*
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
*/

module.exports = { getUserById };