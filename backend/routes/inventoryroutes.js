// routes/inventoryroutes.js
import express from 'express';
import Inventory from '../models/Inventory.js'; 
const router = express.Router();

// Create new inventory item
router.post('/', async (req, res) => {
  try {
    const newItem = new Inventory({
      ...req.body,
      date: req.body.date // Include date field
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create item', error });
  }
});

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory', error });
  }
});

// Update an inventory item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, {
      ...req.body,
      date: req.body.date // Include date field
    }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item', error });
  }
});

// Delete an inventory item by ID
router.delete('/:id', async (req, res) => {
    try {
      const deletedItem = await Inventory.findByIdAndDelete(req.params.id); 
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting inventory item:', error); 
      res.status(500).json({ message: 'Failed to delete item', error });
    }
  });
  

export default router;
