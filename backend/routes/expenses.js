const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// Create a new expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update an expense by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpenseData = req.body; 

    const updatedExpense = await Expense.findByIdAndUpdate(
      id, 
      updatedExpenseData, 
      { new: true } // This option returns the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: 'Failed to update expense' });
  }
});

module.exports = router;
