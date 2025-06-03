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

departmentSchema.virtual('employees',{
     ref:'employee', // the model to use
     localField: '_id', // the id field in the department model ,
     foreignField: 'departmentId' // the field in the employee model that references department 
});

departmentSchema.virtual('manager', {
  ref: 'employee',
  localField: 'managerId',
  foreignField: '_id',
  justOne: true // optional: return a single object instead of array
});


// Enable virtual fields when converting to JSON or Object
// but remove the managerId field , since it is no longer needed when we have the virtual manager field 
departmentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.managerId;
    return ret;
  }
});

departmentSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.managerId;
    return ret;
  }
});

// departmentSchema.set('toObject', { virtuals: true });
// departmentSchema.set('toJSON', { virtuals: true });


// 👇 Add this to remove the `id` getter
departmentSchema.set('id', false);   // this is for the entry point grades/withStudents , so that we don't see an id field 

/*
When you query Mongoose documents and exclude _id, you might still see an id field. This is because:
    Mongoose adds an id getter by default, which is a string version of _id
    the line above is the way to remove it 
*/


const departmentModel = mongoose.model('department', departmentSchema);

module.exports = departmentModel;