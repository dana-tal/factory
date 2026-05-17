const departmentsController = require('../controllers/departmentsController');
const express = require('express');
const router = express.Router();

 /**
  * @swagger
  * /departments:
  *   get:
  *     summary: Get all departments 
  *     tags:
  *       - Departments
  *     responses:
  *       200:
  *         description: List of departments
  *       204: 
  *         description: The request was successful, but there are no departments yet
  *       401:
  *         description: Unauthorized
  *       500:
  *         description: Server error
  */
router.get('/', departmentsController.getAllDepartments);


router.get ('/managers', departmentsController.getAllManagers);

 /**
  * @swagger
  * /departments/names:
  *   get:
  *     summary: Get all departments' names 
  *     tags:
  *       - Departments
  *     responses:
  *       200:
  *         description: List of departments names
  *       204: 
  *         description: The request was successful, but there are no departments yet
  *       401:
  *         description: Unauthorized
  *       500:
  *         description: Server error
  */
router.get('/names', departmentsController.getDepartmentsNames);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID. The department ID can be retrieved from a previous request to GET /departments/names.
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department MongoDB ID
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *       400:
 *         description: Invalid department ID
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.get('/:id', departmentsController.getDepartmentById);

router.get('/editInfo/:id', departmentsController.getDepartmentEditInfo);

router.post('/', departmentsController.addDepartment);

router.put('/:id', departmentsController.updateDepartment);

router.delete('/:id', departmentsController.deleteDepartment);

module.exports = router;