// Employee routes
import express from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { validateEmployee } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getEmployees);
router.post('/', authenticateToken, validateEmployee, createEmployee);
router.put('/:id', authenticateToken, validateEmployee, updateEmployee);
router.delete('/:id', authenticateToken, deleteEmployee);

export default router;