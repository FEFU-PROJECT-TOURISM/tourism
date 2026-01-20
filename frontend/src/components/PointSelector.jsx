// src/components/PointSelector.jsx
import React, { useState, useEffect } from 'react';
import { getPoints } from '../services/api';
import './PointSelector.css';

const PointSelector = ({ selectedPoints = [], onToggle }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const data = await getPoints();
        const pointsArray = Array.isArray(data) ? data : [];
        setPoints(pointsArray);
      } catch (err) {
        console.error('Не удалось загрузить точки:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPoints();
  }, []);

  const filteredPoints = points.filter(point => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      point.name?.toLowerCase().includes(query) ||
      point.description?.toLowerCase().includes(query) ||
      point.latitude?.toString().includes(query) ||
      point.longitude?.toString().includes(query)
    );
  });

  // Ограничиваем количество отображаемых точек
  const MAX_DISPLAYED_POINTS = 7;
  const displayedPoints = filteredPoints.slice(0, MAX_DISPLAYED_POINTS);
  const hasMorePoints = filteredPoints.length > MAX_DISPLAYED_POINTS;

  // Функция для получения URL изображения
  const getImageUrl = (point) => {
    const media = point.media;
    if (Array.isArray(media) && media.length > 0) {
      return media[0]?.url || null;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="point-selector">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Загрузка точек...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="point-selector">
      <div className="selector-header">
        <h3>Выберите точки для тура</h3>
        <p className="selector-subtitle">
          Выберите точки, которые войдут в ваш маршрут
        </p>
      </div>

      {points.length > 0 && (
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Поиск точек..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      <div className="selected-count">
        <span className="count-badge">
          Выбрано: <strong>{selectedPoints.length}</strong>
        </span>
      </div>

      {points.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📍</span>
          <p>Нет доступных точек</p>
          <p className="empty-hint">Создайте новую точку на вкладке "Создать точку"</p>
        </div>
      ) : filteredPoints.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>Ничего не найдено</p>
          <p className="empty-hint">Попробуйте изменить поисковый запрос</p>
        </div>
      ) : (
        <>
          <div className="points-grid">
            {displayedPoints.map(point => {
              const isSelected = selectedPoints.some(p => p.id === point.id);
              const imageUrl = getImageUrl(point);

              return (
                <div
                  key={point.id}
                  className={`point-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggle(point)}
                >
                  {/* Изображение */}
                  {imageUrl ? (
                    <div className="point-image-container">
                      <img 
                        src={imageUrl} 
                        alt={point.name}
                        className="point-image"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Ошибка загрузки изображения:', imageUrl);
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('image-error');
                        }}
                        onLoad={() => {
                          console.log('Изображение загружено:', imageUrl);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="point-image-container point-image-placeholder">
                      <span className="placeholder-icon">📷</span>
                      <span className="placeholder-text">Нет фото</span>
                    </div>
                  )}

                  {/* Контент */}
                  <div className="point-content">
                    <div className="point-name-wrapper">
                      <h4 className="point-name">{point.name}</h4>
                      <div className="point-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggle(point)}
                          onClick={(e) => e.stopPropagation()}
                          className="point-checkbox-input"
                        />
                      </div>
                    </div>
                    <p className="point-description">
                      {point.description || 'Описание отсутствует'}
                    </p>
                    <div className="point-coords">
                      <span className="coord-label">📍</span>
                      <span className="coord-text">
                        {point.latitude?.toFixed(6)}, {point.longitude?.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {hasMorePoints && (
            <div className="points-limit-notice">
              <p>
                <strong>Показано {displayedPoints.length} из {filteredPoints.length} точек.</strong>
                {searchQuery 
                  ? ' Уточните поисковый запрос, чтобы увидеть больше результатов.'
                  : ' Используйте поиск, чтобы найти нужную точку.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PointSelector;
