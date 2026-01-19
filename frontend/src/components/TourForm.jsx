// src/components/TourForm.jsx
import React, { useState } from 'react';
import { createTour } from '../services/api';
import MapComponent from './MapComponent';
import './TourForm.css';

const TourForm = ({ selectedPoints, onPointsReorder, onCreateSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || selectedPoints.length === 0) {
      alert('Введите название и выберите хотя бы одну точку');
      return;
    }

    setLoading(true);
    try {
      // Формируем данные тура с порядком точек
      const tourData = {
        name,
        description,
        tour_points: selectedPoints.map((point, index) => ({
          point_id: point.id,
          order: index
        }))
      };
      await createTour(tourData);
      onCreateSuccess();
    } catch (err) {
      alert('Ошибка создания тура');
    } finally {
      setLoading(false);
    }
  };

  const movePoint = (index, direction) => {
    const newPoints = [...selectedPoints];
    if (direction === 'up' && index > 0) {
      [newPoints[index - 1], newPoints[index]] = [newPoints[index], newPoints[index - 1]];
      onPointsReorder(newPoints);
    } else if (direction === 'down' && index < newPoints.length - 1) {
      [newPoints[index], newPoints[index + 1]] = [newPoints[index + 1], newPoints[index]];
      onPointsReorder(newPoints);
    }
  };

  const removePoint = (index) => {
    const newPoints = selectedPoints.filter((_, i) => i !== index);
    onPointsReorder(newPoints);
  };

  return (
    <form onSubmit={handleSubmit} className="tour-form">
      <div className="form-header">
        <h3>Настройки тура</h3>
        <p className="form-subtitle">Заполните информацию о вашем туре и установите порядок точек</p>
      </div>

      <div className="form-group">
        <label htmlFor="tour-name">
          Название тура <span className="required">*</span>
        </label>
        <input
          id="tour-name"
          type="text"
          placeholder="Например: Экскурсия по историческому центру"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tour-description">Описание тура</label>
        <textarea
          id="tour-description"
          placeholder="Расскажите о вашем туре, его особенностях и интересных моментах..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          className="form-textarea"
        />
      </div>

      {selectedPoints.length > 0 && (
        <>
          <div className="form-group">
            <label>Порядок точек маршрута</label>
            <p className="form-hint">Измените порядок точек, чтобы задать маршрут тура</p>
            <div className="points-order-list">
              {selectedPoints.map((point, index) => (
                <div key={point.id} className="order-item">
                  <div className="order-number">{index + 1}</div>
                  <div className="order-content">
                    <div className="order-point-name">{point.name}</div>
                    <div className="order-point-desc">
                      {point.description || 'Без описания'}
                    </div>
                  </div>
                  <div className="order-actions">
                    <button
                      type="button"
                      onClick={() => movePoint(index, 'up')}
                      disabled={index === 0}
                      className="order-btn"
                      title="Переместить вверх"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => movePoint(index, 'down')}
                      disabled={index === selectedPoints.length - 1}
                      className="order-btn"
                      title="Переместить вниз"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removePoint(index)}
                      className="order-btn remove-btn"
                      title="Удалить из маршрута"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Предпросмотр маршрута</label>
            <div className="map-preview">
              <MapComponent
                points={selectedPoints}
                showRoute={true}
                center={selectedPoints.length > 0 
                  ? [selectedPoints[0].latitude, selectedPoints[0].longitude]
                  : [43.1155, 131.8855]}
                zoom={12}
              />
            </div>
          </div>
        </>
      )}

      <div className="form-info">
        <div className="info-card">
          <span className="info-icon">📍</span>
          <div>
            <div className="info-label">Выбрано точек</div>
            <div className="info-value">{selectedPoints.length}</div>
          </div>
        </div>
        {selectedPoints.length === 0 && (
          <p className="form-warning">
            ⚠️ Выберите хотя бы одну точку для создания тура
          </p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading || selectedPoints.length === 0}
        className="form-submit"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Создание...
          </>
        ) : (
          <>
            <span>✅</span>
            Создать тур
          </>
        )}
      </button>
    </form>
  );
};

export default TourForm;
