// src/pages/TourPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourById } from '../services/api';
import TourPointCard from '../components/TourPointCard';
import MapComponent from '../components/MapComponent';
import './TourPage.css';

const TourPage = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadTour = async () => {
      try {
        const data = await getTourById(tourId);
        setTour(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadTour();
  }, [tourId]);

  if (loading) {
    return (
      <div className="tour-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загрузка тура...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="tour-page">
        <div className="error-state">
          <span className="error-icon">❌</span>
          <h2>Тур не найден</h2>
          <p>Возможно, тур был удален или не существует</p>
          <Link to="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const mainImageUrl = tour.points[0]?.media[0]?.url;
  const pointsCount = tour.points?.length || 0;

  return (
    <div className="tour-page">
      <div className="tour-hero">
        {mainImageUrl && (
          <div className="tour-hero-image">
            <img src={mainImageUrl} alt={tour.name} />
            <div className="hero-overlay"></div>
          </div>
        )}
        <div className="tour-hero-content">
          <Link to="/" className="back-link">
            <span className="back-icon">←</span>
            Назад к турам
          </Link>
          <h1 className="tour-title">{tour.name}</h1>
          {tour.description && (
            <p className="tour-description">{tour.description}</p>
          )}
          <div className="tour-stats">
            <div className="stat-item">
              <span className="stat-icon">📍</span>
              <span>{pointsCount} {pointsCount === 1 ? 'точка' : pointsCount < 5 ? 'точки' : 'точек'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-content">
        <div className="tour-map-section">
          <div className="section-header">
            <h2>Маршрут на карте</h2>
            <p>Просмотрите все точки тура на интерактивной карте</p>
          </div>
          <div className="map-wrapper">
            <MapComponent
              points={tour.points}
              onPointClick={(point) => {
                const element = document.getElementById(`point-${point.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              center={
                tour.points.length > 0
                  ? [tour.points[0].latitude, tour.points[0].longitude]
                  : null
              }
            />
          </div>
        </div>

        <div className="tour-points-section">
          <div className="section-header">
            <h2>Точки маршрута</h2>
            <p>Исследуйте каждую точку вашего тура</p>
          </div>
          {tour.points.length === 0 ? (
            <div className="empty-points">
              <span className="empty-icon">📍</span>
              <p>В этом туре пока нет точек</p>
            </div>
          ) : (
            <div className="tour-points-grid">
              {tour.points.map((point, index) => (
                <div key={point.id} id={`point-${point.id}`}>
                  <TourPointCard point={point} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourPage;
