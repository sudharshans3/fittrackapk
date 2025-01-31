import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import '../styles/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalWorkouts: 0,
    avgCalories: 0,
    workoutDistribution: {},
    weeklyProgress: {},
    statsByType: {}
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workouts/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Fetch stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Chart colors
  const chartColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#7CBA3B'
  ];

  // Prepare data for weekly progress chart
  const weeklyData = {
    labels: Object.keys(stats.weeklyProgress),
    datasets: [
      {
        label: 'Calories Burned',
        data: Object.values(stats.weeklyProgress),
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1
      }
    ]
  };

  // Prepare data for workout distribution pie chart
  const distributionData = {
    labels: Object.keys(stats.workoutDistribution),
    datasets: [
      {
        data: Object.values(stats.workoutDistribution),
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors
      }
    ]
  };

  return (
    <div className="dashboard">
      <h1>Workout Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Workouts</h3>
          <p className="stat-value">{stats.totalWorkouts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Calories Burned</h3>
          <p className="stat-value">{Math.round(stats.totalCalories)}</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Calories/Workout</h3>
          <p className="stat-value">{Math.round(stats.avgCalories)}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Weekly Progress</h3>
          {Object.keys(stats.weeklyProgress).length > 0 ? (
            <Line
              data={weeklyData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Calories Burned This Week'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          ) : (
            <p className="no-data">No workout data available for this week</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Workout Distribution</h3>
          {Object.keys(stats.workoutDistribution).length > 0 ? (
            <Pie
              data={distributionData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Workout Types Distribution'
                  }
                }
              }}
            />
          ) : (
            <p className="no-data">No workout distribution data available</p>
          )}
        </div>
      </div>

      <div className="workout-types-stats">
        <h3>Statistics by Workout Type</h3>
        <div className="types-grid">
          {Object.entries(stats.statsByType).map(([type, typeStats], index) => (
            <div 
              key={type} 
              className="type-card"
              style={{ borderColor: chartColors[index % chartColors.length] }}
            >
              <h4>{type}</h4>
              <div className="type-stats">
                <p>Total Workouts: {typeStats.count}</p>
                <p>Total Calories: {Math.round(typeStats.totalCalories)}</p>
                <p>Avg Calories: {Math.round(typeStats.avgCalories)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;