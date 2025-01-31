import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Contact from './components/Contact';
import Food from './components/Food';
import Login from './components/Login';
import Register from './components/Register';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="top-nav">
          <div className="logo">
            <h1>FitTrack</h1>
          </div>
          <nav className="navbar">
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/workouts">Workouts</Link></li>
              <li><Link to="/food">Food</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/food" element={<Food />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
