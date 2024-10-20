const express = require('express');
const FoodEntry = require('../models/FoodEntry');
const router = express.Router();

// Create a new food entry
router.post('/add', async (req, res) => {
  const { userId, name, calories, carbohydrates, proteins, fats } = req.body;

  try {
    const foodEntry = new FoodEntry({
      user: userId,
      name,
      calories,
      carbohydrates,
      proteins,
      fats,
    });

    await foodEntry.save();
    res.json(foodEntry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all food entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const foodEntries = await FoodEntry.find({ user: req.params.userId });
    res.json(foodEntries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;