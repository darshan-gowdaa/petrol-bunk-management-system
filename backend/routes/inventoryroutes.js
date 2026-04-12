// Inventory routes
import express from 'express';
import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '../controllers/inventoryController.js';
import { validateInventory } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getInventory);
router.post('/', authenticateToken, validateInventory, createInventoryItem);
router.put('/:id', authenticateToken, validateInventory, updateInventoryItem);
router.delete('/:id', authenticateToken, deleteInventoryItem);

export default router;