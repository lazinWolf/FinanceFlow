// models/income.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, required: true }, 
  lastReceived: { type: Date, required: true }, 
});

module.exports = mongoose.model('Income', incomeSchema);