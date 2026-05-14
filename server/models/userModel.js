const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName :{ type:String, required:true},
    maxActions :{type:Number, required:true},
    username: { type:String, required:true},
    email:{ type:String, required:true}
},
{
     versionKey: false,
     timestamps:true
});

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;     
    delete ret._id;
    return ret;
  }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
     delete ret._id;   
    return ret;
  }
});


const userModel = mongoose.model('user',userSchema);


module.exports = userModel;