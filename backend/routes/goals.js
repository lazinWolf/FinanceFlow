// routes/goals.js
const express = require('express');
const router = express.Router();
const Goal = require('../models/goal');

// Create a new goal
router.post('/', async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Get all goals
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single goal by ID
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found'   
 });
    }
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a goal by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGoalData = req.body;

    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      updatedGoalData,
      { new: true } 
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(updatedGoal);
  } catch (err)   
 {
    console.error("Error updating goal:", err);
    res.status(500).json({ message: 'Failed to update goal' });
  }
});

// Delete a goal by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findByIdAndDelete(id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;