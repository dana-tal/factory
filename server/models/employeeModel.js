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


// adding a middleware upon delete of one employee 

employeeSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    const session = this.$session();  //get access to the document session 
    await mongoose.model('employeeShift').deleteMany({ employeeId: this._id }, { session }); // before deleting the employee document, delete his shifts' registrations
    next();  // go on to the next operation ( deleting the employee document )
  } catch (err) {
    next(err); // report the error and stop the transaction 
  }
});

const employeeModel = mongoose.model('employee', employeeSchema);


module.exports = employeeModel;
