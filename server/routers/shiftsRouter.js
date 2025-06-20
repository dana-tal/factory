const express = require('express');
const shiftsController = require('../controllers/shiftsController');

const router = express.Router();

router.get('/', shiftsController.getAllShifts);
router.get('/:id',shiftsController.getShiftById);
router.post('/', shiftsController.addNewShift);
router.put('/:id', shiftsController.updateShift);

module.exports= router;

