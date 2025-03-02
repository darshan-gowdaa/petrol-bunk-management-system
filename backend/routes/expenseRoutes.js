// backend/routes/expenseRoutes.js
import express from 'express';
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from '../controllers/expenseController.js';
import { validateExpense } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getExpenses);
router.post('/', validateExpense, createExpense);
router.put('/:id', validateExpense, updateExpense);
router.delete('/:id', deleteExpense);

export default router;