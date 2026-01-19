// src/components/TourPointCard.jsx
import React, { useState } from 'react';
import './TourPointCard.css';

const TourPointCard = ({ point, index = 0 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const media = point.media || [];

  if (media.length === 0) {
    return (
      <article className="tour-point-card" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="point-images">
          <div className="point-image placeholder">
            <span className="placeholder-icon">📷</span>
            <span className="placeholder-text">Фото недоступно</span>
          </div>
        </div>
        <div className="point-info">
          <div className="point-header">
            <h4 className="point-name">{point.name}</h4>
            <span className="point-badge">📍</span>
          </div>
          <p className="point-description">{point.description || 'Описание отсутствует'}</p>
        </div>
      </article>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % media.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <article className="tour-point-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="point-images">
        <div className="point-images-container">
          {media.map((mediaItem, idx) => (
            <img
              key={mediaItem.id || idx}
              src={mediaItem.url}
              alt={`${point.name} ${idx + 1}`}
              className={`point-image ${idx === currentImageIndex ? 'active' : ''}`}
              loading="lazy"
            />
          ))}
        </div>

        {/* Навигация по фото */}
        {media.length > 1 && (
          <>
            <button
              className="image-nav-btn nav-prev"
              onClick={prevImage}
              aria-label="Предыдущее фото"
            >
              ←
            </button>
            <button
              className="image-nav-btn nav-next"
              onClick={nextImage}
              aria-label="Следующее фото"
            >
              →
            </button>
            <div className="image-indicators">
              {media.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Перейти к фото ${idx + 1}`}
                />
              ))}
            </div>
            <div className="image-counter">
              {currentImageIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>

      <div className="point-info">
        <div className="point-header">
          <h4 className="point-name">{point.name}</h4>
          <span className="point-badge">📍</span>
        </div>
        <p className="point-description">{point.description || 'Описание отсутствует'}</p>
      </div>
    </article>
  );
};

export default TourPointCard;
