const express = require('express');
const employeesController = require('../controllers/employeesController');

const employeesRouter = express.Router();


employeesRouter.get('/', employeesController.getAllEmployees);
employeesRouter.get('/withDepartments', employeesController.getAllEmployeesAndDepartments);
employeesRouter.get('/:id', employeesController.getEmployeeById);
employeesRouter.get('/editInfo/:id', employeesController.getEmployeeEditInfo);

employeesRouter.post('/', employeesController.addNewEmployee);
employeesRouter.put('/:id', employeesController.updateEmployee);
employeesRouter.delete('/:id', employeesController.deleteEmployee);

employeesRouter.post('/register/:id', employeesController.registerEmployeeToShifts );
employeesRouter.post('/unregister/:id', employeesController.unregisterEmployeeFromShifts);

module.exports= employeesRouter;