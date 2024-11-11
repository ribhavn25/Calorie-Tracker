import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DailyCaloriesChart = () => {
    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [{ label: '', data: [] }],
    });
  
    useEffect(() => {
      const fetchCaloriesData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("User is not authenticated");
          return;
        }
  
        // Decode the token to get the userId
        const decoded = jwtDecode(token);
        const userId = decoded.user.id;
  
        try {
          const response = await axios.get(`http://localhost:3001/api/stats/daily-calories/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
  
          const dates = Object.keys(response.data);
          const calories = Object.values(response.data);
  
          setChartData({
            labels: dates,
            datasets: [
              {
                label: 'Daily Calorie Intake',
                data: calories,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching calorie data:', error);
        }
      };
  
      fetchCaloriesData();
  
      // Cleanup function to unmount the chart when the component unmounts
      return () => setChartData({ labels: [], datasets: [] });
    }, []); // Empty dependency array to run only once
  
    return <Line data={chartData} />;
  };
  
  export default DailyCaloriesChart;