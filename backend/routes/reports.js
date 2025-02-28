import express from 'express';
import mongoose from 'mongoose';
import Sale from '../models/Sale.js'; // Assuming Sale model exists
import Expense from '../models/Expense.js'; // Assuming Expense model exists

const router = express.Router();

// Sample route to get reports
router.get('/', async (req, res) => {
    try {
        const monthlySales = await Sale.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const yearlySales = await Sale.aggregate([
            {
                $group: {
                    _id: { $year: "$date" },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const monthlyExpenses = await Expense.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const yearlyExpenses = await Expense.aggregate([
            {
                $group: {
                    _id: { $year: "$date" },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        res.json({
            monthlySales,
            yearlySales,
            monthlyExpenses,
            yearlyExpenses
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

export default router;
