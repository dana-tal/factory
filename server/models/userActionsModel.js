const mongoose = require('mongoose');


const userActionsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    actionsDate :{ type:Date, required:true},
    actionsCount :{type:Number, required:true}
},
{
     versionKey: false,
     timestamps:true
});

// Create a unique compound index
userActionsSchema.index({ userId: 1, actionsDate: 1 }, { unique: true });

const userActionsModel = mongoose.model('userActions',userActionsSchema,'userActions');


module.exports = userActionsModel;