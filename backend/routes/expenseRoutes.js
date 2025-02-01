// routes/expenseRoutes.js
import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    // Format date before sending response
    const formattedExpenses = expenses.map((expense) => ({
      ...expense.toObject(),
      date: new Date(expense.date).toLocaleDateString(), // Format date
    }));
    res.json(formattedExpenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  const { category, amount, date } = req.body;
  const newExpense = new Expense({ category, amount, date });

  try {
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
});

// Edit an existing expense
router.put('/:id', async (req, res) => {
  const { category, amount, date } = req.body;
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { category, amount, date },
      { new: true }
    );
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
});

export default router;
