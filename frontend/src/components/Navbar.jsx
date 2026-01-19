// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🗺️</span>
          <span className="brand-text">Туристические экскурсии</span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Главная
            </Link>
          </li>
          <li>
            <Link 
              to="/create-tour" 
              className={location.pathname === '/create-tour' ? 'active' : ''}
            >
              <span className="nav-icon">➕</span>
              Создать тур
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
