const express = require('express');
const shiftsController = require('../controllers/shiftsController');

const router = express.Router();

/**
 * @swagger
 * /shifts:
 *   get:
 *     tags:
 *       - Shifts
 *     summary: Get all shifts
 *     responses:
 *       200:
 *         description: List of shifts
 *       204:
 *         description: No shifts found
 *       500:
 *         description: Server error
 */
router.get('/', shiftsController.getAllShifts);

/**
 * @swagger
 * /shifts/{id}:
 *   get:
 *     tags:
 *       - Shifts
 *     summary: Get shift by ID. The shift ID can be retrieved from a previous request to GET /shifts.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift MongoDB ID
 *     responses:
 *       200:
 *         description: Shift retrieved successfully
 *       400:
 *         description: Invalid shift ID
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Server error
 */
router.get('/:id',shiftsController.getShiftById);
router.get('/editInfo/:id', shiftsController.getShiftEditInfo);
router.post('/', shiftsController.addNewShift);
router.put('/:id', shiftsController.updateShift);
router.post('/register/:id', shiftsController.registerEmployeesToShift);
router.post('/unregister/:id',shiftsController.unregisterEmployeesFromShift);

module.exports= router;

