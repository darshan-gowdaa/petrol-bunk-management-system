// backend/models/Inventory.js - Inventory data model
import mongoose from 'mongoose';

export default mongoose.model('Inventory', new mongoose.Schema({
  name: { type: String, required: true },
  currentStock: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
  date: { type: Date, required: true }
}));
