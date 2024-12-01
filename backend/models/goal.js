// models/goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  goalName: { type: String, required: true, maxlength: 255 },
  targetAmount: { type: Number, required: true, min: 0 },
  currentSavings: { type: Number, required: true, min: 0, default: 0 },
  targetDate: { type: Date, required: true },
});

module.exports = mongoose.model('Goal', goalSchema);
