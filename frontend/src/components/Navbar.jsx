// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, getOrganization, logout } from '../services/auth';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const organization = getOrganization();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <span className="brand-icon">🗺️</span>
          <span className="brand-text">Туристические экскурсии</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={mobileMenuOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={closeMobileMenu}
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
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">➕</span>
                  Создать тур
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className={location.pathname === '/login' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Войти
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={location.pathname === '/register' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Регистрация
                </Link>
              </li>
            </>
          )}
        </ul>

        {authenticated && organization && (
          <div className={`nav-org-info ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <span className="org-name">{organization.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
