const express = require('express');
const router = express.Router();
const Bill = require('../models/bill');

// Create a new bill
router.post('/', async (req, res) => {
  try {
    const bill = new Bill(req.body);  // Create a new Bill instance from the request body
    await bill.save();               // Save the bill to the database
    res.status(201).json(bill);       // Respond with the created bill
  } catch (err) {
    res.status(400).json({ error: err.message });  // Handle validation errors
  }
});

// Get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();  // Retrieve all bills from the database
    res.json(bills);                  // Return the bills as a JSON array
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle server errors
  }
});

// Delete a bill by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByIdAndDelete(id);  // Find and delete the bill by ID

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });  // Handle case when bill is not found
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });  // Handle server errors
  }
});

// Update a bill by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBillData = req.body;  // Get the updated data from the request body

    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      updatedBillData,
      { new: true }  // Return the updated document
    );

    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });  // Handle case when bill is not found
    }

    res.json(updatedBill);  // Respond with the updated bill
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bill' });  // Handle errors
  }
});

module.exports = router;
