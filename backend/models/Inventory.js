// models/inventory.js
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentStock: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
  date: { type: Date, required: true } // Added date field
});


const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
