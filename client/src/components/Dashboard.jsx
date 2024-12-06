import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [goal, setGoal] = useState({ calories: 0, carbohydrates: 0, proteins: 0, fats: 0 });
  const [tempGoal, setTempGoal] = useState({ calories: 0, carbohydrates: 0, proteins: 0, fats: 0 });
  const [foodItem, setFoodItem] = useState({ name: '', calories: 0, carbohydrates: 0, proteins: 0, fats: 0 });
  const [loadingGoals, setLoadingGoals] = useState(true);

  useEffect(() => {
    fetchGoals();
    fetchFoodEntries();
  }, []);

  const fetchFoodEntries = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You're not logged in. Please log in first.");
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/api/food', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setFoodEntries(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        console.error('Error fetching food entries:', error);
      }
    }
  };

  const fetchGoals = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You're not logged in. Please log in first.");
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:3001/api/goals', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const serverGoal = response.data;
      let goalData;
      
      if (serverGoal) {
        // Map server fields to frontend fields
        goalData = {
          calories: serverGoal.dailyCalorieGoal,
          carbohydrates: serverGoal.dailyCarbohydrateGoal,
          proteins: serverGoal.dailyProteinGoal,
          fats: serverGoal.dailyFatGoal
        };
      } else {
        // If no goals are set, default to zero
        goalData = { calories: 0, carbohydrates: 0, proteins: 0, fats: 0 };
      }
  
      setGoal(goalData);
      setTempGoal(goalData);
      setLoadingGoals(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        console.error('Error fetching goals:', error);
      }
    }
  };

  const updateGoals = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You're not logged in. Please log in first.");
      return;
    }
  
    try {
      const payload = {
        dailyCalorieGoal: tempGoal.calories,
        dailyCarbohydrateGoal: tempGoal.carbohydrates,
        dailyProteinGoal: tempGoal.proteins,
        dailyFatGoal: tempGoal.fats
      };
  
      await axios.post('http://localhost:3001/api/goals/set', payload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setGoal(tempGoal);
      alert('Goals updated successfully');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        console.error('Error updating goals:', error);
      }
    }
  };

  const addFoodItem = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You're not logged in. Please log in first.");
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/food/add', foodItem, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchFoodEntries();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        console.error('Error adding food item:', error);
      }
    }
  };

  const removeFoodItem = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You're not logged in. Please log in first.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/food/remove/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchFoodEntries();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        console.error('Error removing food item:', error);
      }
    }
  };

  // Compute totals based on current food entries
  const totalCalories = foodEntries.reduce((sum, item) => sum + item.calories, 0);
  const totalCarbs = foodEntries.reduce((sum, item) => sum + item.carbohydrates, 0);
  const totalProteins = foodEntries.reduce((sum, item) => sum + item.proteins, 0);
  const totalFats = foodEntries.reduce((sum, item) => sum + item.fats, 0);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Dashboard</h1>

      {/* Log Food Section */}
      <div className="dashboard-section">
        <h2>Log Food</h2>
        <div className="food-log-form">
          <input type="text" placeholder="Name" onChange={(e) => setFoodItem({ ...foodItem, name: e.target.value })} />
          <input type="number" placeholder="Calories" onChange={(e) => setFoodItem({ ...foodItem, calories: parseInt(e.target.value) })} />
          <input type="number" placeholder="Carbs" onChange={(e) => setFoodItem({ ...foodItem, carbohydrates: parseInt(e.target.value) })} />
          <input type="number" placeholder="Proteins" onChange={(e) => setFoodItem({ ...foodItem, proteins: parseInt(e.target.value) })} />
          <input type="number" placeholder="Fats" onChange={(e) => setFoodItem({ ...foodItem, fats: parseInt(e.target.value) })} />
          <button className="submit" onClick={addFoodItem}>Add Food</button>
        </div>
      </div>

      {/* Food Entries Section */}
      <div className="dashboard-section">
        <h2>Your Food Entries</h2>
        <ul className="food-list">
          {foodEntries.map(entry => (
            <li key={entry._id} className="food-item">
              {entry.name} - {entry.calories} kcal
              <button className="remove-btn" onClick={() => removeFoodItem(entry._id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Set Goals Section */}
      <div className="dashboard-section">
        <h2>Set Your Goals</h2>
        {loadingGoals ? (
          <p>Loading goals...</p>
        ) : (
          <div className="goal-form">
            <input
              type="number"
              placeholder="Calorie Goal"
              value={tempGoal.calories || ''}
              onChange={(e) => setTempGoal({ ...tempGoal, calories: parseInt(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Carb Goal"
              value={tempGoal.carbohydrates || ''}
              onChange={(e) => setTempGoal({ ...tempGoal, carbohydrates: parseInt(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Protein Goal"
              value={tempGoal.proteins || ''}
              onChange={(e) => setTempGoal({ ...tempGoal, proteins: parseInt(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Fat Goal"
              value={tempGoal.fats || ''}
              onChange={(e) => setTempGoal({ ...tempGoal, fats: parseInt(e.target.value) })}
            />
            <button className="submit" onClick={updateGoals}>Update Goals</button>
          </div>
        )}
      </div>

      {/* Progress Bars Section */}
      <div className="dashboard-section">
        <h2>Today's Progress</h2>
        <div className="progress-item">
          <label>Calories: {totalCalories} / {goal.calories}</label>
          <progress value={totalCalories} max={goal.calories || 1}></progress>
        </div>
        <div className="progress-item">
          <label>Carbs: {totalCarbs} / {goal.carbohydrates}</label>
          <progress value={totalCarbs} max={goal.carbohydrates || 1}></progress>
        </div>
        <div className="progress-item">
          <label>Proteins: {totalProteins} / {goal.proteins}</label>
          <progress value={totalProteins} max={goal.proteins || 1}></progress>
        </div>
        <div className="progress-item">
          <label>Fats: {totalFats} / {goal.fats}</label>
          <progress value={totalFats} max={goal.fats || 1}></progress>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;