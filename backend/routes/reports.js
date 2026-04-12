// Reports routes
import express from 'express';
import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const getAggregatedData = async (Model, groupBy) => {
    const groupStage = groupBy === 'month'
        ? { month: { $month: "$date" }, year: { $year: "$date" } }
        : { year: { $year: "$date" } };

    const fieldToSum = Model.modelName === 'Sale' ? '$total' : '$amount';

    return Model.aggregate([
        {
            $group: {
                _id: groupStage,
                total: { $sum: fieldToSum }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const [monthlySales, yearlySales, monthlyExpenses, yearlyExpenses] = await Promise.all([
            getAggregatedData(Sale, 'month'),
            getAggregatedData(Sale, 'year'),
            getAggregatedData(Expense, 'month'),
            getAggregatedData(Expense, 'year')
        ]);

        res.json({ monthlySales, yearlySales, monthlyExpenses, yearlyExpenses });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

export default router;
