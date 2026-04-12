// Expense routes
import express from 'express';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';
import { validateExpense } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getExpenses);
router.post('/', authenticateToken, validateExpense, createExpense);
router.put('/:id', authenticateToken, validateExpense, updateExpense);
router.delete('/:id', authenticateToken, deleteExpense);

export default router;