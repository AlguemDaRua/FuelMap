import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-dot"></span>
        <span className="navbar-title">FuelMap</span>
      </div>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/login" className="navbar-btn">Portal Bombas →</Link>
      </div>
    </nav>
  );
}

export default Navbar;