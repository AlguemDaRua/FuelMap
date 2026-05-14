import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-dot"></span>
        <span className="navbar-title">FuelMap</span>
      </div>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        {isAuthenticated ? (
          <>
            <Link to="/gestao">Gestão</Link>
            <span className="navbar-user">
              {user?.name?.split(' ')[0]}
            </span>
            <button className="navbar-btn navbar-btn-outline" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-btn">Portal Bombas →</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;