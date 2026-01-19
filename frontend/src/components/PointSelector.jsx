// src/components/PointSelector.jsx
import React, { useState, useEffect } from 'react';
import { getPoints } from '../services/api';
import './PointSelector.css';

const PointSelector = ({ selectedIds, onToggle }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const data = await getPoints();
        setPoints(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Не удалось загрузить точки:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPoints();
  }, []);

  const filteredPoints = points.filter(point =>
    point.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Выбрано: <strong>{selectedIds.length}</strong>
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
        <div className="points-grid">
          {filteredPoints.map(point => {
            const isSelected = selectedIds.includes(point.id);
            const imageUrl = point.media?.[0]?.url;
            
            return (
              <div
                key={point.id}
                className={`point-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onToggle(point.id)}
              >
                <div className="point-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(point.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="checkmark"></span>
                </div>
                
                {imageUrl && (
                  <div className="point-image">
                    <img src={imageUrl} alt={point.name} />
                  </div>
                )}
                
                <div className="point-content">
                  <h4 className="point-name">{point.name}</h4>
                  <p className="point-description">
                    {point.description || 'Описание отсутствует'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PointSelector;
