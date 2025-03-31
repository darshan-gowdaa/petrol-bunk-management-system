// backend/routes/sales.js - Sales management routes
import express from 'express';
import {
  getSales,
  createSale,
  updateSale,
  deleteSale
} from '../controllers/salesController.js';
import { validateSale } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getSales);
router.post('/', validateSale, createSale);
router.put('/:id', validateSale, updateSale);
router.delete('/:id', deleteSale);

export default router;