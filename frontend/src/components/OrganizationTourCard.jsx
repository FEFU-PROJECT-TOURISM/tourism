// src/components/OrganizationTourCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OrganizationTourCard.css';

// Константы для обрезки текста
const MAX_TITLE_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 120;

const OrganizationTourCard = ({ tour, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!tour) {
    return (
      <div className="org-tour-card org-tour-card-skeleton">
        <div className="org-tour-image-skeleton"></div>
        <div className="org-tour-content-skeleton">
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

  // Обрезаем название, если оно слишком длинное
  const truncatedName = name && name.length > MAX_TITLE_LENGTH 
    ? `${name.substring(0, MAX_TITLE_LENGTH)}...` 
    : name;

  // Обрезаем описание, если оно слишком длинное
  const truncatedDescription = description && description.length > MAX_DESCRIPTION_LENGTH
    ? `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
    : description;

  return (
    <Link to={`/tour/${id}`} className="org-tour-card-link">
      <article className="org-tour-card" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="org-tour-image-wrapper">
          <div className="org-tour-image">
            {imageUrl && !imageError ? (
              <>
                {!imageLoaded && <div className="org-image-placeholder"></div>}
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
              <div className="org-image-placeholder">
                <span className="org-placeholder-icon">🗺️</span>
              </div>
            )}
          </div>
          <div className="org-tour-badge">
            <span className="org-badge-icon">📍</span>
            <span>{pointsCount} {pointsCount === 1 ? 'точка' : pointsCount < 5 ? 'точки' : 'точек'}</span>
          </div>
        </div>

        <div className="org-tour-content">
          <h3 className="org-tour-title" title={name}>
            {truncatedName}
          </h3>
          <p className="org-tour-location">
            <span className="org-location-icon">📍</span>
            {pointName}
          </p>
          <p className="org-tour-description">
            {truncatedDescription || 'Описание отсутствует'}
          </p>
          <div className="org-tour-footer">
            <span className="org-tour-link">
              Подробнее
              <span className="org-arrow">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default OrganizationTourCard;
