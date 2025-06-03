const departmentsController = require('../controllers/departmentsController');
const express = require('express');
const router = express.Router();


router.get('/', departmentsController.getAllDepartments);


module.exports = router;