
const mongoose = require('mongoose');

const employeeShiftSchema =  new mongoose.Schema ({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'employee'},
    shiftId: {type: mongoose.Schema.Types.ObjectId, ref: 'shift'}
});

// prevent duplicates  (same employee & shift)
employeeShiftSchema.index({ employee: 1, shift: 1 }, { unique: true });

module.exports = mongoose.model('employeeShift', employeeShiftSchema);