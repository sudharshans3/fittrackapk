import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo">🦬</span>
        <Link to="/" className="brand-name">Fittrack</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link active">Dashboard</Link>
        <Link to="/workouts" className="nav-link">Workouts</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
