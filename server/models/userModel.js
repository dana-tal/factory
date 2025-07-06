const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName :{ type:String, required:true},
    maxActions :{type:Number, required:true}
},
{
     versionKey: false,
     timestamps:true
});



const userModel = mongoose.model('user',userSchema);


module.exports = userModel;