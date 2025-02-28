import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find(); // Fetch all expenses from the database
        res.status(200).json(expenses); // Send the expenses back in the response
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});

// Route to add a new expense
router.post('/', async (req, res) => {
    const { category, amount, date } = req.body;
    try {
        const newExpense = new Expense({ category, amount, date });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Error adding expense' });
    }
});

// Route to update an existing expense
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { category, amount, date } = req.body;
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, { category, amount, date }, { new: true });
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Error updating expense' });
    }
});

router.delete('/:id', async (req, res) => {
    console.log(`Received request to delete expense with ID: ${req.params.id}`);

    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense' });
    }
});

export default router;
