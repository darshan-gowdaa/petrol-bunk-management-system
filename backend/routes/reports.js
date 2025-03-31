// backend/routes/reports.js - Reports and analytics routes
import express from 'express';
import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';

const router = express.Router();

const getAggregatedData = async (Model, groupBy) => {
    return Model.aggregate([
        {
            $group: {
                _id: { [groupBy]: "$date" },
                total: { $sum: "$amount" }
            }
        }
    ]);
};

router.get('/', async (req, res) => {
    try {
        const [monthlySales, yearlySales, monthlyExpenses, yearlyExpenses] = await Promise.all([
            getAggregatedData(Sale, '$month'),
            getAggregatedData(Sale, '$year'),
            getAggregatedData(Expense, '$month'),
            getAggregatedData(Expense, '$year')
        ]);

        res.json({ monthlySales, yearlySales, monthlyExpenses, yearlyExpenses });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

export default router;
