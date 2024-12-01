const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  name: { type: String, required: true },            // The name of the bill (e.g., "Netflix Subscription")
  amount: { type: Number, required: true },          // The amount of the bill (e.g., 15.99)
  frequency: { type: String, required: true },       // Frequency of the bill (e.g., "Monthly")
  nextDue: { type: Date, required: true },           // The next due date of the bill
  status: { type: String, default: "Pending" },      // The status of the bill (e.g., "Pending", "Paid")
});

module.exports = mongoose.model('Bill', billSchema);  // Export the model for use in routes
