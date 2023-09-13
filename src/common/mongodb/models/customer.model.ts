import mongoose from 'mongoose';

export const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

export const customerModel = mongoose.model('Customer', customerSchema);
