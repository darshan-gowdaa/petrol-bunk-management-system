// Sales routes
import express from 'express';
import {
  getSales,
  createSale,
  updateSale,
  deleteSale
} from '../controllers/salesController.js';
import { validateSale } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getSales);
router.post('/', authenticateToken, validateSale, createSale);
router.put('/:id', authenticateToken, validateSale, updateSale);
router.delete('/:id', authenticateToken, deleteSale);

export default router;