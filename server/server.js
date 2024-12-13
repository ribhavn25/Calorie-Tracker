// server.js

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const foodEntryRoutes = require('./routes/foodEntries');
const nutritionalGoalRoutes = require('./routes/nutritionalGoals');
const cors = require('cors');  // Import cors
const cron = require('node-cron'); // Import node-cron
const FoodEntry = require('./models/FoodEntry'); // Make sure the path is correct

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors());  // Enable CORS for all origins

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodEntryRoutes);              
app.use('/api/goals', nutritionalGoalRoutes);       

// Schedule a job to run at 23:59 every day in CST
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running daily cleanup job: deleting all food entries...');
    await FoodEntry.deleteMany({}); // Delete all documents in the FoodEntry collection
    console.log('All food entries deleted successfully.');
  } catch (err) {
    console.error('Error during daily cleanup job:', err);
  }
}, {
  scheduled: true,
  timezone: "America/Chicago" // This ensures the job runs at 23:59 CST/CDT
});

// Listen on a port (from .env or default to 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
