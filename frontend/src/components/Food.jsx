import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Food.css';

const Food = () => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    day: '',
    mealType: '',
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/meals');
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mealData = {
        ...newMeal,
        calories: parseInt(newMeal.calories),
        protein: parseInt(newMeal.protein),
        carbs: parseInt(newMeal.carbs),
        fats: parseInt(newMeal.fats)
      };

      await axios.post('http://localhost:5000/api/meals', mealData);
      
      setNewMeal({
        day: '',
        mealType: '',
        food: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
      
      fetchMeals();
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/meals/${id}`);
      fetchMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  // Group meals by day
  const mealsByDay = meals.reduce((acc, meal) => {
    const day = meal.day || 'Unscheduled';
    if (!acc[day]) {
      acc[day] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      };
    }
    acc[day][meal.mealType.toLowerCase()].push(meal);
    return acc;
  }, {});

  return (
    <div className="food-container">
      <div className="add-meal-form">
        <h2>Add New Meal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Day:</label>
            <select 
              name="day" 
              value={newMeal.day} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="form-group">
            <label>Meal Type:</label>
            <select
              name="mealType"
              value={newMeal.mealType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Meal Type</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <div className="form-group">
            <label>Food:</label>
            <input
              type="text"
              name="food"
              value={newMeal.food}
              onChange={handleInputChange}
              placeholder="e.g., Oatmeal with fruits"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Calories:</label>
              <input
                type="number"
                name="calories"
                value={newMeal.calories}
                onChange={handleInputChange}
                placeholder="Calories"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Protein (g):</label>
              <input
                type="number"
                name="protein"
                value={newMeal.protein}
                onChange={handleInputChange}
                placeholder="Protein"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Carbs (g):</label>
              <input
                type="number"
                name="carbs"
                value={newMeal.carbs}
                onChange={handleInputChange}
                placeholder="Carbs"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Fats (g):</label>
              <input
                type="number"
                name="fats"
                value={newMeal.fats}
                onChange={handleInputChange}
                placeholder="Fats"
                min="0"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Add Meal</button>
        </form>
      </div>

      <div className="meal-schedule">
        <h2>Weekly Meal Plan</h2>
        <div className="schedule-grid">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <div key={day} className="day-column">
              <h3>{day}</h3>
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(mealType => (
                <div key={mealType} className="meal-section">
                  <h4>{mealType}</h4>
                  <div className="meal-list">
                    {mealsByDay[day]?.[mealType.toLowerCase()]?.map(meal => (
                      <div key={meal._id} className="meal-card">
                        <h5>{meal.food}</h5>
                        <div className="meal-stats">
                          <p><strong>Calories:</strong> {meal.calories}</p>
                          <p><strong>Protein:</strong> {meal.protein}g</p>
                          <p><strong>Carbs:</strong> {meal.carbs}g</p>
                          <p><strong>Fats:</strong> {meal.fats}g</p>
                        </div>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(meal._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Food;
