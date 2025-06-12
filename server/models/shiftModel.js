const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    startDate :{ type:Date, required:true},
    endDate :{type:Date, required:true}
},
{
     versionKey: false,
     timestamps:true
});


const shiftModel = mongoose.model('shift',shiftSchema);


module.exports = shiftModel;