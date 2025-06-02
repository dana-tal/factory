const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
     name: { type:String, required:true},
     managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'employee',
            required:true
     }
},
    { 
        versionKey: false,
        timestamps:true
    });

const departmentModel = mongoose.model('department', departmentSchema);

module.exports = departmentModel;