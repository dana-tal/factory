const departmentsController = require('../controllers/departmentsController');
const express = require('express');
const router = express.Router();


router.get('/', departmentsController.getAllDepartments);

router.get('/names', departmentsController.getDepartmentsNames);

router.get('/:id', departmentsController.getDepartmentById);

router.post('/', departmentsController.addDepartment);

router.put('/:id', departmentsController.updateDepartment);

router.delete('/:id', departmentsController.deleteDepartment);

module.exports = router;