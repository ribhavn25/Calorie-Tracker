const mongoose = require('mongoose');

// Define Nutritional Goal Schema
const nutritionalGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dailyCalorieGoal: {
    type: Number,
    required: true,
  },
  dailyCarbohydrateGoal: {
    type: Number,
    required: true,
  },
  dailyProteinGoal: {
    type: Number,
    required: true,
  },
  dailyFatGoal: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('NutritionalGoal', nutritionalGoalSchema);