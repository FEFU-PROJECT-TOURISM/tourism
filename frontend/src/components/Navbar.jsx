// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Туристические экскурсии</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Главная</Link></li>
        <li><Link to="/create-tour">Создать тур</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
