// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import { getTours } from '../services/api';
import './Home.css';

const Home = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const data = await getTours();
        setTours(Array.isArray(data) && data.length > 0 ? data : Array(6).fill(null));
      } catch (err) {
        setTours(Array(6).fill(null));
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Откройте мир путешествий</div>
          <h1 className="hero-title">
            Откройте для себя
            <span className="gradient-text"> удивительные места</span>
          </h1>
          <p className="hero-description">
            Исследуйте уникальные маршруты и создавайте незабываемые воспоминания
            с нашими тщательно подобранными туристическими экскурсиями
          </p>
          <div className="hero-actions">
            <Link to="/create-tour" className="btn btn-primary">
              <span>➕</span>
              Создать свой тур
            </Link>
            <a href="#tours" className="btn btn-secondary">
              Исследовать туры
            </a>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      <main id="tours" className="tours-section">
        <div className="section-header">
          <h2 className="section-title">Наши туры</h2>
          <p className="section-subtitle">
            {loading ? 'Загрузка...' : `Найдено туров: ${tours.filter(t => t).length}`}
          </p>
        </div>
        {loading ? (
          <div className="tours-loading">
            <div className="loading-spinner"></div>
            <p>Загрузка туров...</p>
          </div>
        ) : (
          <div className="tours-grid">
            {tours.map((tour, index) => (
              <TourCard key={tour?.id || index} tour={tour} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
