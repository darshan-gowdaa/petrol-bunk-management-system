// backend/models/Employee.js - Employee data model
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    dateAdded: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);