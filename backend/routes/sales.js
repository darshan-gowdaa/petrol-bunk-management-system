import express from 'express';
import Sale from '../models/Sale.js';

const router = express.Router();

// Create a new sale
router.post('/', async (req, res) => {
    try {
        const { product, quantity, price } = req.body;

        if (!product || quantity <= 0 || price <= 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const total = quantity * price;
        const sale = new Sale({ product, quantity, price, total });

        const savedSale = await sale.save();
        res.status(201).json(savedSale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find();
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a sale
router.put('/:id', async (req, res) => {
    try {
        const { product, quantity, price } = req.body;
        if (!product || quantity <= 0 || price <= 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const total = quantity * price;
        const updatedSale = await Sale.findByIdAndUpdate(
            req.params.id,
            { product, quantity, price, total },
            { new: true }
        );

        res.status(200).json(updatedSale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a sale
router.delete('/:id', async (req, res) => {
    try {
        await Sale.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
