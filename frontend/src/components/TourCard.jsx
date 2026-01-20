// src/components/TourCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TourCard.css';

const TourCard = ({ tour, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!tour) {
    return (
      <div className="tour-card tour-card-skeleton">
        <div className="tour-image-skeleton"></div>
        <div className="tour-content-skeleton">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-location"></div>
          <div className="skeleton-line skeleton-description"></div>
        </div>
      </div>
    );
  }

  const { id, name, description, points } = tour;

  const imageUrl = points?.[0]?.media?.[0]?.url;
  const pointName = points?.[0]?.name || 'Локация не указана';
  const pointsCount = points?.length || 0;

  return (
    <Link to={`/tour/${id}`} className="tour-card-link">
      <article className="tour-card" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="tour-image-wrapper">
          <div className="tour-image">
            {imageUrl && !imageError ? (
              <>
                {!imageLoaded && <div className="image-placeholder"></div>}
                <img
                  src={imageUrl}
                  alt={name}
                  onLoad={() => {
                    setImageError(false);
                    setImageLoaded(true);
                  }}
                  onError={() => setImageError(true)}
                  className={imageLoaded ? 'loaded' : ''}
                />
              </>
            ) : (
              <div className="image-placeholder">
                <span className="placeholder-icon">🗺️</span>
              </div>
            )}
          </div>
          <div className="tour-badge">
            <span className="badge-icon">📍</span>
            <span>{pointsCount} {pointsCount === 1 ? 'точка' : pointsCount < 5 ? 'точки' : 'точек'}</span>
          </div>
        </div>

        <div className="tour-content">
          <h3 className="tour-title" title={name}>
            {name}
          </h3>
          <p className="tour-location">
            <span className="location-icon">📍</span>
            {pointName}
          </p>
          <p className="tour-description">
            {description && description.length > 100 
              ? `${description.slice(0, 100)}...` 
              : description || 'Описание отсутствует'}
          </p>
          <div className="tour-footer">
            <span className="tour-link">
              Подробнее
              <span className="arrow">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default TourCard;
