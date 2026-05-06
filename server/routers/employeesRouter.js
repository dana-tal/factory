const express = require('express');
const employeesController = require('../controllers/employeesController');

const employeesRouter = express.Router();

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags:
*       - Employees
 *     responses:
 *       200:
 *         description: List of employees
 *       204:
 *         description: No employees found
 *       500:
 *         description: Server error
 */
employeesRouter.get('/', employeesController.getAllEmployees);
employeesRouter.get('/withDepartments', employeesController.getAllEmployeesAndDepartments);
/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get employee by ID. The employee ID can be retrieved from a previous request to GET /employees.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee MongoDB ID
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *       400:
 *         description: Invalid employee ID
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
employeesRouter.get('/:id', employeesController.getEmployeeById);
employeesRouter.get('/editInfo/:id', employeesController.getEmployeeEditInfo);

employeesRouter.post('/', employeesController.addNewEmployee);
employeesRouter.put('/:id', employeesController.updateEmployee);
employeesRouter.delete('/:id', employeesController.deleteEmployee);

employeesRouter.post('/register/:id', employeesController.registerEmployeeToShifts );
employeesRouter.post('/unregister/:id', employeesController.unregisterEmployeeFromShifts);

module.exports= employeesRouter;