const express = require('express');
const NutritionalGoal = require('../models/NutritionalGoal');
const auth = require('../middleware/auth'); // Import the auth middleware
const router = express.Router();

// Set or update nutritional goals (protected route)
router.post('/set', auth, async (req, res) => {
  const { dailyCalorieGoal, dailyCarbohydrateGoal, dailyProteinGoal, dailyFatGoal } = req.body;

  try {
    let goal = await NutritionalGoal.findOne({ user: req.user.id });

    if (goal) {
      // Update existing goals
      goal.dailyCalorieGoal = dailyCalorieGoal;
      goal.dailyCarbohydrateGoal = dailyCarbohydrateGoal;
      goal.dailyProteinGoal = dailyProteinGoal;
      goal.dailyFatGoal = dailyFatGoal;
      await goal.save();
    } else {
      // Create new goals
      goal = new NutritionalGoal({
        user: req.user.id, // Get user ID from token
        dailyCalorieGoal,
        dailyCarbohydrateGoal,
        dailyProteinGoal,
        dailyFatGoal,
      });
      await goal.save();
    }

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get the nutritional goals for a user (protected route)
router.get('/', auth, async (req, res) => {
  try {
    const goals = await NutritionalGoal.findOne({ user: req.user.id });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;