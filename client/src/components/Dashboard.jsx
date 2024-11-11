import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DailyCaloriesChart from './DailyCaloriesChart'; // Component to render daily calories chart
import './Dashboard.css';

const Dashboard = () => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [goal, setGoal] = useState({ calories: 0, carbohydrates: 0, proteins: 0, fats: 0 });
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
      // Use a default object if response.data is null or undefined
      const goalData = response.data || { calories: 0, carbohydrates: 0, proteins: 0, fats: 0 };
      setGoal(goalData);
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
      await axios.post('http://localhost:3001/api/goals/set', goal, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Dashboard</h1>

      {/* Log Food Section */}
      <div className="dashboard-section">
        <h2>Log Food</h2>
        <div className="food-log-form">
          <input type="text" placeholder="Name" onChange={(e) => setFoodItem({ ...foodItem, name: e.target.value })} />
          <input type="number" placeholder="Calories" onChange={(e) => setFoodItem({ ...foodItem, calories: e.target.value })} />
          <input type="number" placeholder="Carbs" onChange={(e) => setFoodItem({ ...foodItem, carbohydrates: e.target.value })} />
          <input type="number" placeholder="Proteins" onChange={(e) => setFoodItem({ ...foodItem, proteins: e.target.value })} />
          <input type="number" placeholder="Fats" onChange={(e) => setFoodItem({ ...foodItem, fats: e.target.value })} />
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
              value={goal?.calories || ''}
              onChange={(e) => setGoal({ ...goal, calories: e.target.value })}
            />
            <input
              type="number"
              placeholder="Carb Goal"
              value={goal?.carbohydrates || ''}
              onChange={(e) => setGoal({ ...goal, carbohydrates: e.target.value })}
            />
            <input
              type="number"
              placeholder="Protein Goal"
              value={goal?.proteins || ''}
              onChange={(e) => setGoal({ ...goal, proteins: e.target.value })}
            />
            <input
              type="number"
              placeholder="Fat Goal"
              value={goal?.fats || ''}
              onChange={(e) => setGoal({ ...goal, fats: e.target.value })}
            />
            <button className="submit" onClick={updateGoals}>Update Goals</button>
          </div>
        )}
      </div>

      {/* Daily Progress Section */}
      <div className="dashboard-section">
        <h2>Daily Progress</h2>
        <DailyCaloriesChart />
      </div>
    </div>
  );
};

export default Dashboard;