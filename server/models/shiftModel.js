const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    startDate :{ type:Date, required:true},
    endDate :{type:Date, required:true}
},
{
     versionKey: false,
     timestamps:true
});

shiftSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;     
    delete ret._id;
    return ret;
  }
});

shiftSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
     delete ret._id;   
    return ret;
  }
});


const shiftModel = mongoose.model('shift',shiftSchema);


module.exports = shiftModel;