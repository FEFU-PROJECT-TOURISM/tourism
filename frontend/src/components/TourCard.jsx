// src/components/TourCard.jsx
import React, { useState } from 'react';
import './TourCard.css';

const TourCard = ({ tour }) => {
  const [imageError, setImageError] = useState(false);

  if (!tour) {
    return (
      <div className="tour-card">
        <span className="coming-soon">В разработке</span>
      </div>
    );
  }

  const { name, description, points } = tour;

  // Берём первое изображение
  const media = points?.[0]?.media?.[0];
  const imageUrl = media?.url;
  const pointName = points?.[0]?.name || 'Локация не указана';
  const pointDescription = points?.[0]?.description || '';

  // Сбрасываем ошибку при смене тура
  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className="tour-card">
      <div className="tour-image">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '12px' }}
          />
        ) : (
          <img
            src="/placeholder.jpg"
            alt="Заглушка"
            style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '12px' }}
          />
        )}
      </div>

      <h3 className="tour-title">{name}</h3>
      <p className="tour-location">{pointName}</p>
      <p className="tour-description">
        {description.length > 80 ? `${description.slice(0, 80)}...` : description}
      </p>
    </div>
  );
};

export default TourCard;
