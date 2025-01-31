import React, { useState } from 'react';
import proteinRichFoods from '../data/proteinFoods';
import '../styles/Food.css';

const Food = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);
  
  const categories = ['all', ...new Set(proteinRichFoods.map(food => food.category))];
  
  const filteredFoods = selectedCategory === 'all' 
    ? proteinRichFoods 
    : proteinRichFoods.filter(food => food.category === selectedCategory);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="food-container">
      <h2>Protein-Rich Foods</h2>
      
      <div className="category-filter">
        <label>Filter by Category: </label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="food-grid">
        {filteredFoods.map((food, index) => (
          <div key={index} className="food-card">
            <h3>{food.name}</h3>
            <div className="food-info">
              <p><strong>Protein:</strong> {food.protein}g</p>
              <p><strong>Serving Size:</strong> {food.servingSize}</p>
              <p><strong>Calories:</strong> {food.calories}</p>
              <p><strong>Category:</strong> {food.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
