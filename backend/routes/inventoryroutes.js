// backend/routes/inventoryroutes.js
import express from 'express';
import { 
  getInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../controllers/inventoryController.js';
import { validateInventory } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', validateInventory, createInventoryItem);
router.put('/:id', validateInventory, updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;