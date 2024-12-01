// routes/incomes.js 
const express = require('express');
const router = express.Router();
const Income = require('../models/income'); // Assuming your model file is named 'income.js'

// Create a new income source
router.post('/', async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all income sources
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find();
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an income source by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findByIdAndDelete(id);

    if (!income) {
      return res.status(404).json({ message: 'Income source not found' });
    }

    res.json({ message: 'Income source deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update an income source by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedIncomeData = req.body; 

    const updatedIncome = await Income.findByIdAndUpdate(
      id, 
      updatedIncomeData, 
      { new: true } 
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income source not found' });
    }

    res.json(updatedIncome);
  } catch (err) {
    console.error("Error updating income source:", err);
    res.status(500).json({ message: 'Failed to update income source' });
  }
});

module.exports = router;