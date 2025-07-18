
const mongoose = require('mongoose');

const employeeShiftSchema =  new mongoose.Schema ({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'employee'},
    shiftId: {type: mongoose.Schema.Types.ObjectId, ref: 'shift'}
});

// prevent duplicates  (same employee & shift)
employeeShiftSchema.index({ employeeId: 1, shiftId: 1 }, { unique: true });

module.exports = mongoose.model('employeeShift', employeeShiftSchema,'employeeShifts');