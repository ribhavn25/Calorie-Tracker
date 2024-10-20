const express = require('express');
const NutritionalGoal = require('../models/NutritionalGoal');
const router = express.Router();

// Set or update nutritional goals
router.post('/set', async (req, res) => {
  const { userId, dailyCalorieGoal, dailyCarbohydrateGoal, dailyProteinGoal, dailyFatGoal } = req.body;

  try {
    let goal = await NutritionalGoal.findOne({ user: userId });

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
        user: userId,
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

// Get the nutritional goals for a user
router.get('/:userId', async (req, res) => {
  try {
    const goals = await NutritionalGoal.findOne({ user: req.params.userId });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;