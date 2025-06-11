const express = require('express');
const employeesController = require('../controllers/employeesController');

const employeesRouter = express.Router();


employeesRouter.get('/', employeesController.getAllEmployees);
employeesRouter.get('/:id', employeesController.getEmployeeById);
employeesRouter.post('/', employeesController.addNewEmployee);
employeesRouter.put('/:id', employeesController.updateEmployee);
employeesRouter.delete('/:id', employeesController.deleteEmployee);

module.exports= employeesRouter;