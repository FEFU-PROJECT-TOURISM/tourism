// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, getOrganization, logout } from '../services/auth';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const organization = getOrganization();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          {authenticated ? (
            <>
              <li>
                <Link 
                  to="/create-tour" 
                  className={location.pathname === '/create-tour' ? 'active' : ''}
                >
                  <span className="nav-icon">➕</span>
                  Создать тур
                </Link>
              </li>
              <li className="nav-org-info">
                <span className="org-name">{organization?.name || 'Организация'}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className={location.pathname === '/login' ? 'active' : ''}
                >
                  Войти
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={location.pathname === '/register' ? 'active' : ''}
                >
                  Регистрация
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
