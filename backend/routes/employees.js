// backend/routes/employees.js
import express from 'express';
import { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employeeController.js';
import { validateEmployee } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getEmployees);
router.post('/', validateEmployee, createEmployee);
router.put('/:id', validateEmployee, updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;