const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {type:String , required:true},
    lastName: {type:String , required:true},
    startYear: { type:Number, required:true},
    departmentId: 
    {  
        type: mongoose.Schema.Types.ObjectId,
        ref:'department',
        required:true
    }
}, {
     versionKey: false,
     timestamps:true
});

const employeeModel = mongoose.model('employee', employeeSchema);

module.exports = employeeModel;
