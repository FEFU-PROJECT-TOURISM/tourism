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
    // Скроллим к началу страницы при переходе на страницу тура
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [tourId]);

  useEffect(() => {
    const loadTour = async () => {
      try {
        const data = await getTourById(tourId);
        setTour(data);
        // После загрузки данных также убеждаемся, что мы в начале страницы
        // Используем небольшой таймаут, чтобы дать время на рендеринг
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 100);
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
          <div className="tour-stats">
            <div className="stat-item">
              <span className="stat-icon">📍</span>
              <span>{pointsCount} {pointsCount === 1 ? 'точка' : pointsCount < 5 ? 'точки' : 'точек'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-content">
        {tour.description && (
          <div className="tour-description-section">
            <div className="section-header">
              <h2>Описание тура</h2>
            </div>
            <div className="description-content">
              <p>{tour.description}</p>
            </div>
          </div>
        )}

        <div className="tour-map-section">
          <div className="section-header">
            <h2>Маршрут на карте</h2>
            <p>Просмотрите все точки тура на интерактивной карте с маршрутом</p>
          </div>
          <div className="map-wrapper">
            <MapComponent
              points={tour.points}
              showRoute={true}
              onPointClick={(point) => {
                const element = document.getElementById(`point-${point.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              center={
                tour.points.length > 0
                  ? [tour.points[0].latitude, tour.points[0].longitude]
                  : [43.1155, 131.8855]
              }
              zoom={12}
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

        {tour.organization && (
          <div className="tour-organization-section">
            <div className="section-header">
              <h2>Организация</h2>
              <p>Информация об организации, создавшей этот тур</p>
            </div>
            <div className="organization-card">
              <div className="org-info">
                <Link to={`/organization/${tour.organization.id}`} className="org-link">
                  <h3>{tour.organization.name}</h3>
                </Link>
                <p className="org-email">{tour.organization.email}</p>
                {tour.organization.address && (
                  <p className="org-address">📍 {tour.organization.address}</p>
                )}
                {tour.organization.phones && tour.organization.phones.length > 0 && (
                  <div className="org-phones">
                    <span className="phones-label">Телефоны:</span>
                    {tour.organization.phones.map((phone, idx) => (
                      <span key={idx} className="phone-item">+{phone.phone}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPage;
