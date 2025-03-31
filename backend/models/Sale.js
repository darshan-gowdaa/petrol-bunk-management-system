// backend/models/Sale.js - Sales data model
import mongoose from 'mongoose';

export default mongoose.model('Sale', new mongoose.Schema({
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}));
