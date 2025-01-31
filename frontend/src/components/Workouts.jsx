import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Workouts.css";

// MET values for different exercises (Metabolic Equivalent of Task)
const EXERCISE_METS = {
  // Cardio exercises
  'Running': 10.0,
  'Jogging': 7.0,
  'Cycling': 8.0,
  'Swimming': 8.0,
  'Jump Rope': 12.0,
  'Walking': 3.5,
  'Rowing': 7.0,
  'Elliptical': 5.0,
  'Stair Climbing': 8.0,
  
  // Strength training exercises
  'Push-ups': 3.5,
  'Pull-ups': 3.8,
  'Squats': 5.0,
  'Lunges': 4.0,
  'Bench Press': 3.8,
  'Deadlift': 6.0,
  'Shoulder Press': 3.5,
  'Bicep Curls': 3.0,
  'Tricep Extensions': 3.0,
  'Plank': 3.0,
  
  // Default value for unknown exercises
  'default': 3.0
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    day: "",
    type: "",
    exercise: "",
    sets: "",
    reps: "",
    duration: "",
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/workouts");
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  // Calculate calories burned based on exercise type, sets, reps, and duration
  const calculateCaloriesBurned = (exercise, sets, reps, duration) => {
    // Get MET value for the exercise (or use default if not found)
    const met = EXERCISE_METS[exercise] || EXERCISE_METS.default;
    
    // Average weight in kg (you can make this customizable if needed)
    const averageWeight = 70;
    
    let totalCalories = 0;
    
    if (duration) {
      // If duration is provided, calculate calories for time-based exercises
      // Formula: Calories = MET × Weight (kg) × Duration (hours)
      totalCalories = met * averageWeight * (duration / 60);
    } else if (sets && reps) {
      // For strength exercises with sets and reps
      // Assume each rep takes about 4 seconds
      const totalMinutes = (sets * reps * 4) / 60;
      totalCalories = met * averageWeight * (totalMinutes / 60);
      
      // Add additional calories for resistance training
      const resistanceBonus = (sets * reps * 0.1);
      totalCalories += resistanceBonus;
    }
    
    return Math.round(totalCalories);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const caloriesBurned = calculateCaloriesBurned(
        newWorkout.exercise,
        parseInt(newWorkout.sets),
        parseInt(newWorkout.reps),
        parseInt(newWorkout.duration)
      );

      const workoutData = {
        ...newWorkout,
        sets: newWorkout.sets ? parseInt(newWorkout.sets) : null,
        reps: newWorkout.reps ? parseInt(newWorkout.reps) : null,
        duration: newWorkout.duration ? parseInt(newWorkout.duration) : null,
        caloriesBurned
      };

      await axios.post("http://localhost:5000/api/workouts", workoutData);
      
      // Clear form and refresh workouts
      setNewWorkout({
        day: "",
        type: "",
        exercise: "",
        sets: "",
        reps: "",
        duration: ""
      });
      
      fetchWorkouts();
    } catch (error) {
      console.error("Error adding workout:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`);
      fetchWorkouts();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  // Group workouts by day
  const workoutsByDay = workouts.reduce((acc, workout) => {
    const day = workout.day || 'Unscheduled';
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(workout);
    return acc;
  }, {});

  return (
    <div className="workouts-container">
      <div className="add-workout-form">
        <h2>Add New Workout</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Day:</label>
            <select 
              name="day" 
              value={newWorkout.day} 
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
            <label>Type:</label>
            <select
              name="type"
              value={newWorkout.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="Flexibility">Flexibility</option>
              <option value="HIIT">HIIT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Exercise:</label>
            <select
              name="exercise"
              value={newWorkout.exercise}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Exercise</option>
              {Object.keys(EXERCISE_METS).filter(ex => ex !== 'default').map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sets:</label>
              <input
                type="number"
                name="sets"
                value={newWorkout.sets}
                onChange={handleInputChange}
                placeholder="Number of sets"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Reps:</label>
              <input
                type="number"
                name="reps"
                value={newWorkout.reps}
                onChange={handleInputChange}
                placeholder="Reps per set"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duration (minutes):</label>
            <input
              type="number"
              name="duration"
              value={newWorkout.duration}
              onChange={handleInputChange}
              placeholder="Duration in minutes"
              min="0"
            />
          </div>

          <button type="submit" className="submit-btn">Add Workout</button>
        </form>
      </div>

      <div className="workout-schedule">
        <h2>Workout Schedule</h2>
        <div className="schedule-grid">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <div key={day} className="day-column">
              <h3>{day}</h3>
              <div className="workout-list">
                {workoutsByDay[day]?.map(workout => (
                  <div key={workout._id} className="workout-card">
                    <h4>{workout.type}</h4>
                    <p><strong>Exercise:</strong> {workout.exercise}</p>
                    {workout.sets && <p><strong>Sets:</strong> {workout.sets}</p>}
                    {workout.reps && <p><strong>Reps:</strong> {workout.reps}</p>}
                    {workout.duration && <p><strong>Duration:</strong> {workout.duration} min</p>}
                    <p><strong>Calories:</strong> {workout.caloriesBurned}</p>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(workout._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
