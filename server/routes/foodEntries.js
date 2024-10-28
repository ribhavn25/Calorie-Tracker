const express = require('express');
const FoodEntry = require('../models/FoodEntry');
const auth = require('../middleware/auth');  // Middleware to verify the token
const router = express.Router();

// Create a new food entry (protected route)
router.post('/add', auth, async (req, res) => {
  const { name, calories, carbohydrates, proteins, fats } = req.body;

  try {
    const foodEntry = new FoodEntry({
      user: req.user.id,  // Get user ID from the token
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

// Get all food entries for a user (protected route)
router.get('/', auth, async (req, res) => {
  try {
    const foodEntries = await FoodEntry.find({ user: req.user.id });
    res.json(foodEntries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;